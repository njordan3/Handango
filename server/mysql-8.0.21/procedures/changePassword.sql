DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `changePassword`(
	IN e VARCHAR(64),
    IN pass_hash_new VARCHAR(72),
    IN d_s CHAR(128)
)
BEGIN
	DECLARE err VARCHAR(300) DEFAULT "Error";

	DECLARE pass_hash_old VARCHAR(72);
    DECLARE ext_id VARCHAR(64);
	SET pass_hash_old = (SELECT password_hash FROM user WHERE email = e);
    SET ext_id = (SELECT external_id FROM user WHERE email = e);
    IF (NOT ISNULL(pass_hash_old)) THEN
		UPDATE user
        SET password_hash = pass_hash_new, last_password_change = NOW(), disable_secret = d_s, passwordchange_secret = NULL
        WHERE email = e AND external_type IS NULL;
		# only change the password if the account isn't external
		
		IF EXISTS(
			SELECT email
			FROM user
			WHERE password_hash = pass_hash_old
		) THEN 
			SET err = CONCAT(e, " had trouble changing their password");
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
        END IF;
	ELSE
		SET err = CONCAT(e, " tried to change their password as an external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    
    CALL findUserProc(e, ext_id);
END ;;