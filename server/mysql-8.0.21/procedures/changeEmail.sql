DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeEmail`(
	IN e VARCHAR(255),
	IN e_new VARCHAR(255),
    IN ev_s CHAR(128),
    IN d_s CHAR(128)
)
BEGIN
	DECLARE err VARCHAR(300) DEFAULT "Error";
	
    DECLARE ext_id VARCHAR(8);
    SET ext_id = (SELECT external_id FROM user WHERE email = e);

	IF (ISNULL(ext_id)) THEN
		UPDATE user
        SET email = e_new, old_email = e, emailverify_secret = ev_s, disable_secret = d_s , verified = 0, last_email_change = NOW()
        WHERE email = e AND external_id IS NULL;
		# only change the email if the account isn't external
		
		IF EXISTS (
			SELECT email
			FROM user
			WHERE email = e
		) THEN 
			SET err = CONCAT(e, " had trouble changing their email");
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
		END IF;
	ELSE 
		SET err = CONCAT(e, " tried to change their email as an external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    
    CALL findUserProc(e_new, ext_id);
END ;;