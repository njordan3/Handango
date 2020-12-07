DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `incrementLoginAttempt`(IN e VARCHAR(255))
BEGIN
	DECLARE attempts TINYINT;

	UPDATE user SET login_attempts = login_attempts+1 WHERE email = e;

    SET attempts = (SELECT login_attempts FROM user WHERE email = e);

	IF (attempts >= 5) THEN
		UPDATE user SET disabled = 1 WHERE email = e;
    END IF;
END ;;