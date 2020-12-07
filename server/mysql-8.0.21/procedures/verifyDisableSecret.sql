DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `verifyDisableSecret`(IN d_s CHAR(128), IN type_ VARCHAR(25))
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";

	DECLARE e VARCHAR(255);
    DECLARE ext_id VARCHAR(64);
    DECLARE last_change TIMESTAMP;
    SET e = (SELECT email FROM user WHERE disable_secret = d_s);
    SET ext_id = (SELECT external_id FROM user WHERE email = e AND disable_secret = d_s);
	
    #external accounts can't be disabled from password changes
	IF (NOT ISNULL(ext_id)) THEN
		SET err = CONCAT(e, " tried to verify disable secret of external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    IF (NOT ISNULL(e)) THEN
		IF (type_ = "password") THEN
			SET last_change = (SELECT last_password_change FROM user WHERE email = e AND external_id IS NULL AND disable_secret = d_s);
        ELSEIF (type_ = "email") THEN
			SET last_change = (SELECT last_email_change FROM user WHERE email = e AND external_id IS NULL AND disable_secret = d_s);
        ELSE
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Disable verification type not found";
        END IF;
        IF (NOW() < (last_change + INTERVAL 1 HOUR)) THEN
			UPDATE user SET disabled = 1, disable_secret = NULL WHERE email = e AND external_id IS NULL AND disable_secret = d_s;
        ELSE
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Disable token expired";
        END IF;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Unknown disable token";
    END IF;

	CALL findUserProc(e, ext_id);
END ;;