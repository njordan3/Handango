DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeLoginType`(
	IN fn_new VARCHAR(30), IN ln_new VARCHAR(30),
	IN e VARCHAR(255), IN e_new VARCHAR(255),
    IN u VARCHAR(50),
    IN ev_s VARCHAR(128),
    IN pass_hash_new VARCHAR(64),
    IN ext_type_new VARCHAR(8),
    IN ext_id VARCHAR(64), IN ext_id_new VARCHAR(64)
)
BEGIN
	#new username for going to external accounts
	DECLARE user_name VARCHAR(50);
    IF (NOT ISNULL((SELECT username FROM user WHERE email = e))) THEN
		SET user_name = (SELECT username FROM user WHERE email = e);
    ELSE
		IF (ISNULL(u)) THEN
			SET user_name = CONCAT("user", (SELECT id FROM user WHERE email = e));
		ELSE 
			SET user_name = u;
        END IF;
    END IF;

	IF (ISNULL(ext_id_new)) THEN
		# going from external to email account
		UPDATE user SET 
			email = e_new, old_email = e,
            username = user_name,
            last_email_change = NOW(),
			password_hash = pass_hash_new,
            last_password_change = NOW(),
            emailverify_secret = ev_s,
			verified = 0,
			external_type = NULL, 
			external_ID = NULL
		WHERE email = e AND external_ID = ext_id;
	ELSE 						
		# going from email to external account or
        # external account to different external account
		UPDATE user SET
			fname = fn_new,
            lname = ln_new,
			email = e_new, old_email = e,
            username = user_name,
			last_email_change = NOW(),
			password_hash = NULL,
			last_password_change = NOW(),
			external_type = ext_type_new, 
			external_ID = ext_id_new
		WHERE email = e;
    END IF;
    
    CALL duohando.findUserProc(e_new, ext_id_new);
END ;;