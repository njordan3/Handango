DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Login`(IN e VARCHAR(255), IN ext_id VARCHAR(64))
BEGIN
		#CALL duohando.findUserProc(e, ext_ID);
		CALL duohando.setLoginAttempt(e, 0);
		UPDATE user SET last_login = NOW() WHERE email = e;
END ;;