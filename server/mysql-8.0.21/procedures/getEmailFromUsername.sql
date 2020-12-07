DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getEmailFromUsername`(IN u VARCHAR(50))
BEGIN
	SELECT email, fname FROM user WHERE username = u;
END ;;