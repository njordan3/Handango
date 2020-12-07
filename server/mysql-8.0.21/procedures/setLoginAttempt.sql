DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setLoginAttempt`(IN e VARCHAR(255), IN attempts TINYINT)
BEGIN
	IF (attempts >= 5) THEN
		UPDATE user SET disabled = 1, login_attempts = attempts WHERE email = e;
	ELSEIF (attempts = 0) THEN
		UPDATE user SET last_login = NOW(), login_attempts = attempts WHERE email = e;
    ELSE
		UPDATE user SET login_attempts = attempts WHERE email = e;
    END IF;
END ;;