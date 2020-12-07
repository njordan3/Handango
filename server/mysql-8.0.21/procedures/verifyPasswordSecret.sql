DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `verifyPasswordSecret`(IN p_s CHAR(128))
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";
    
    DECLARE last_change TIMESTAMP;
    DECLARE e VARCHAR(255);
    DECLARE ext_id VARCHAR(64);
    SET e = (SELECT email FROM user WHERE passwordchange_secret = p_s);
    SET ext_id = (SELECT external_id FROM user WHERE email = e AND passwordchange_secret = p_s);
    
    #external accounts can't be verified for password changes
	IF (NOT ISNULL(ext_id)) THEN
		SET err = CONCAT(e, " tried to verify password secret of external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    IF (NOT ISNULL(e)) THEN
		SET last_change = (SELECT last_password_change FROM user WHERE email = e AND external_id IS NULL AND passwordchange_secret = p_s);
        IF (NOW() > (last_change + INTERVAL 1 HOUR)) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Password token expired";
        END IF;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Unknown password token";
    END IF;
    
    CALL findUserProc(e, ext_id);
END ;;