DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `addPasswordSecret`(IN e VARCHAR(255), IN ext_id VARCHAR(64), IN p_s CHAR(128))
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";

	IF(ISNULL(ext_id)) THEN
		UPDATE user SET passwordchange_secret = p_s WHERE email = e AND external_id IS NULL AND passwordchange_secret IS NULL;
	ELSE 
		SET err = CONCAT(e, " tried to set a password secret as external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
	END IF;
    
    CALL findUserProc(e, ext_id);
END ;;