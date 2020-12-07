DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `add2FA`(IN e VARCHAR(255), IN ext_id VARCHAR(64), IN s VARCHAR(32))
BEGIN
	DECLARE err VARCHAR(300) DEFAULT "Error";
	
    DECLARE is2FA VARCHAR(32);
	IF(ISNULL(ext_id)) THEN
		SET is2FA = (SELECT twofactor_secret FROM user WHERE email = e AND external_id IS NULL);
	ELSE 
		SET is2FA = (SELECT twofactor_secret FROM user WHERE email = e AND external_id = ext_id);
	END IF;
    
    IF (ISNULL(is2FA)) THEN
		IF(ISNULL(ext_id)) THEN
			UPDATE user SET twofactor_secret = s WHERE email = e AND external_id IS NULL AND twofactor_secret IS NULL;
        ELSE 
			UPDATE user SET twofactor_secret = s WHERE email = e AND external_id = ext_id AND twofactor_secret IS NULL;
        END IF;
    ELSE
		SET err = CONCAT(e, " already has 2FA on");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    
    #throw error if secret is still null
    IF(ISNULL(ext_id)) THEN
		SET is2FA = (SELECT twofactor_secret FROM user WHERE email = e AND external_id IS NULL);
	ELSE 
		SET is2FA = (SELECT twofactor_secret FROM user WHERE email = e AND external_id = ext_id);
	END IF;
	IF (ISNULL(is2FA)) THEN
		SET err = CONCAT(e, " had an issue setting their secret");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
	END IF;
    
    CALL findUserProc(e, ext_id);
END ;;