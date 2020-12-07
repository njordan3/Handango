DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Register`(
	IN fn VARCHAR(30), IN ln VARCHAR(30),
	IN e VARCHAR(255), IN u VARCHAR(50),
    IN tf_s VARCHAR(32), IN ev_s VARCHAR(128),
	IN pass_hash VARCHAR(64),
	IN ext_type VARCHAR(8), IN ext_ID VARCHAR(64)
)
BEGIN
	#username for external accounts
	DECLARE user_name VARCHAR(50);
	SET user_name = CONCAT("user", (SELECT id+1 FROM user ORDER BY id DESC LIMIT 1));
    
	IF (ISNULL(ext_type)) THEN
		INSERT INTO user(fname, lname, email, username, twofactor_secret, emailverify_secret, password_hash) 
        VALUES (fn, ln, e, u, tf_s, ev_s, pass_hash);
    ELSE
		#external accounts are automatically verified
		INSERT INTO user(fname, lname, email, username, twofactor_secret, external_type, external_id, verified) 
        VALUES (fn, ln, e, user_name, tf_s, ext_type, ext_ID, 1);
	END IF;
    
	CALL findUserProc(e, ext_ID);
END ;;