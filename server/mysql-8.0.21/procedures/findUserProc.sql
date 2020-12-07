DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `findUserProc`(IN e VARCHAR(255), IN ext_id VARCHAR(64))
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";
    
	#DECLARE d TINYINT(1);
    DECLARE email_exists TINYINT(1);
    #IF (ISNULL(ext_id)) THEN
	#	SET d = (SELECT disabled FROM user WHERE email = e AND external_id IS NULL);
    #ELSE
    #	SET d = (SELECT disabled FROM user WHERE email = e AND external_id = ext_id);
    #END IF;
    
    SET email_exists = (SELECT 0 FROM user WHERE email = e);
    
    IF (email_exists = 0) THEN
		#IF (d = 0) THEN
			IF (ISNULL(ext_id)) THEN
				SELECT id, fname, lname, email, username, twofactor_secret, emailverify_secret, password_hash, passwordchange_secret, login_attempts, disabled, disable_secret, verified, external_id, external_type
				FROM user
				WHERE email = e AND external_id IS NULL;
			ELSE
				SELECT id, fname, lname, email, username, twofactor_secret, emailverify_secret, password_hash, passwordchange_secret, login_attempts, disabled, disable_secret, verified, external_id, external_type
				FROM user
				WHERE email = e AND external_id = ext_id;
			END IF;
		#ELSEIF(d = 1) THEN
			#UPDATE user SET login_attempts = login_attempts+1 WHERE email = e;
			#SET err = CONCAT(e, " is disabled");
			#SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
		#END IF;
	ELSE
		SET err = CONCAT(e, " doesn't exist");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
END ;;