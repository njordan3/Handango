DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `verifyEmailSecret`(IN ev_s CHAR(128))
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";

	DECLARE e VARCHAR(255);
    DECLARE ext_id VARCHAR(64);
    DECLARE last_change TIMESTAMP;
    SET e = (SELECT email FROM user WHERE emailverify_secret = ev_s);
    SET ext_id = (SELECT external_id FROM user WHERE email = e AND emailverify_secret = ev_s);
    
    #external accounts don't need email verification
    IF (NOT ISNULL(ext_id)) THEN
		SET err = CONCAT(e, " tried to verify email secret of external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    IF (NOT ISNULL(e)) THEN
        SET last_change = (SELECT last_email_change FROM user WHERE email = e AND external_id IS NULL AND emailverify_secret = ev_s);
        IF (NOW() < (last_change + INTERVAL 1 HOUR)) THEN
			UPDATE user SET verified = 1, emailverify_secret = NULL WHERE email = e AND external_id IS NULL AND emailverify_secret = ev_s;
        ELSE
			#only delete users if they were just created
			DELETE FROM user WHERE email = e AND create_time = last_change;
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Email token expired";
        END IF;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Unknown email token";
    END IF;

	CALL findUserProc(e, ext_id);
END ;;