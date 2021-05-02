CREATE DATABASE  IF NOT EXISTS `duohando` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `duohando`;
-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: duohando
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'duohando'
--
/*!50003 DROP FUNCTION IF EXISTS `findUserFunc` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `findUserFunc`(e VARCHAR(255), ext_id VARCHAR(64)) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	IF (ISNULL(ext_id)) THEN
		RETURN EXISTS(
			SELECT email
			FROM user
			WHERE email = e AND external_id IS NULL
		);
    ELSE
		RETURN EXISTS(
			SELECT email
			FROM user
			WHERE email = e AND external_id = ext_id
        );
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add2FA` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
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
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `addLesson` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `addLesson`(IN e VARCHAR(255), IN ext_id VARCHAR(64))
BEGIN
	DECLARE lesson_count TINYINT;
    DECLARE current_lesson TINYINT;
    
    DECLARE new_lecture_id INT;
    DECLARE new_practice_id INT;
    DECLARE new_quiz_id INT;
    
    DECLARE u_id INT;
    
    SET lesson_count = (SELECT COUNT(DISTINCT id) FROM lesson);
    
    IF (ISNULL(ext_id)) THEN
		SET u_id = (SELECT id FROM user WHERE email = e AND ext_id IS NULL);
	ELSE 
		SET u_id = (SELECT id FROM user WHERE email = e AND ext_id = ext_id);
    END IF;
    
    SET current_lesson = (SELECT MAX(lesson_id) FROM user_has_lesson AS uhl WHERE uhl.user_id = u_id)+1;
	SET new_lecture_id = (SELECT MAX(l.id) FROM lecture as l)+1;
    SET new_practice_id = (SELECT MAX(p.id) FROM practice as p)+1;
    SET new_quiz_id = (SELECT MAX(q.id) FROM quiz as q)+1;
	
    IF (current_lesson < lesson_count+1) THEN
		INSERT INTO user_has_lesson(user_id, lesson_id, lecture_id, practice_id, quiz_id)
        VALUES (u_id, current_lesson, new_lecture_id, new_practice_id, new_quiz_id);
	END IF;
    
    CALL findUserProc(e, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `addPasswordSecret` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
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
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `changeEmail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeEmail`(
	IN e VARCHAR(255),
	IN e_new VARCHAR(255),
    IN ev_s CHAR(128),
    IN d_s CHAR(128)
)
BEGIN
	DECLARE err VARCHAR(300) DEFAULT "Error";
	
    DECLARE ext_id VARCHAR(8);
    SET ext_id = (SELECT external_id FROM user WHERE email = e);

	IF (ISNULL(ext_id)) THEN
		UPDATE user
        SET email = e_new, old_email = e, emailverify_secret = ev_s, disable_secret = d_s , verified = 0, last_email_change = NOW()
        WHERE email = e AND external_id IS NULL;
		# only change the email if the account isn't external
		
		IF EXISTS (
			SELECT email
			FROM user
			WHERE email = e
		) THEN 
			SET err = CONCAT(e, " had trouble changing their email");
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
		END IF;
	ELSE 
		SET err = CONCAT(e, " tried to change their email as an external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    
    CALL findUserProc(e_new, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `changeLoginType` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeLoginType`(
	IN fn_new VARCHAR(30), IN ln_new VARCHAR(30),
	IN e VARCHAR(255), IN e_new VARCHAR(255),
    IN u VARCHAR(50),
    IN ev_s VARCHAR(128),
    IN pass_hash_new VARCHAR(64),
    IN ext_type_new VARCHAR(8),
    IN ext_id VARCHAR(64), IN ext_id_new VARCHAR(64)
)
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";
	#new username for going to external accounts
	DECLARE user_name VARCHAR(50);
	
    IF (e != e_new AND EXISTS(SELECT * FROM user WHERE email = e_new)) THEN
		SET err = CONCAT(e_new, " already exists");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    
	IF (ISNULL(u)) THEN
		SET user_name = CONCAT("user", (SELECT id FROM user WHERE email = e));
	ELSE 
		SET user_name = u;
	END IF;

	IF (ISNULL(ext_id_new)) THEN
		# going from external to email account
		UPDATE user SET 
			email = e_new, old_email = e,
            username = user_name,
            last_email_change = NOW(),
			password_hash = pass_hash_new,
            last_password_change = NOW(),
            emailverify_secret = ev_s,
			verified = 0,
			external_type = NULL, 
			external_ID = NULL
		WHERE email = e AND external_ID = ext_id;
	ELSE 						
		# going from email to external account or
        # external account to different external account
		UPDATE user SET
			fname = fn_new,
            lname = ln_new,
			email = e_new, old_email = e,
            username = user_name,
			last_email_change = NOW(),
			password_hash = NULL,
			last_password_change = NOW(),
			external_type = ext_type_new, 
			external_ID = ext_id_new
		WHERE email = e;
    END IF;
    
    CALL duohando.findUserProc(e_new, ext_id_new);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `changePassword` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `changePassword`(
	IN e VARCHAR(255),
    IN pass_hash_new VARCHAR(72),
    IN d_s CHAR(128)
)
BEGIN
	DECLARE err VARCHAR(300) DEFAULT "Error";

	DECLARE pass_hash_old VARCHAR(72);
    DECLARE ext_id INT;
    
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
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `findUserProc` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
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
				SELECT *
				FROM user
				WHERE email = e AND external_id IS NULL;
                #SELECT 
				#	user.*,
				#	GROUP_CONCAT(lesson.desc ORDER BY lesson.id) AS lesson_desc,
                #    GROUP_CONCAT(h.unlock_date ORDER BY lesson.id) AS lesson_udate,
                #    GROUP_CONCAT(h.lecture_progress ORDER BY lesson.id) AS lesson_lectprog,
                #    GROUP_CONCAT(h.practice_progress ORDER BY lesson.id) AS lesson_practprog,
				#	GROUP_CONCAT(h.practice_complete ORDER BY lesson.id) AS lesson_practcomp,
                #    GROUP_CONCAT(h.quiz_complete ORDER BY lesson.id) AS lesson_complete
				#FROM user
				#	INNER JOIN user_has_lesson AS h ON h.user_id = user.id
				#	INNER JOIN lesson ON lesson.id = h.lesson_id
				#WHERE email = e AND external_id IS NULL GROUP BY user.id;
			ELSE
				SELECT *
				FROM user
				WHERE email = e AND external_id = ext_id;
                #SELECT
				#	user.*, 
				#	GROUP_CONCAT(lesson.desc ORDER BY lesson.id) AS lesson_desc,
                #   GROUP_CONCAT(h.unlock_date ORDER BY lesson.id) AS lesson_udate,
                #   GROUP_CONCAT(h.lecture_progress ORDER BY lesson.id) AS lesson_lectprog,
                #   GROUP_CONCAT(h.practice_progress ORDER BY lesson.id) AS lesson_practprog,
                #   GROUP_CONCAT(h.practice_complete ORDER BY lesson.id) AS lesson_practcomp,
				#   GROUP_CONCAT(h.quiz_complete ORDER BY lesson.id) AS lesson_complete
				#FROM user
				#	INNER JOIN user_has_lesson AS h ON h.user_id = user.id
				#	INNER JOIN lesson ON lesson.id = h.lesson_id
				#WHERE email = e AND external_id = ext_id GROUP BY user.id;
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
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getEmailFromUsername` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getEmailFromUsername`(IN u VARCHAR(50))
BEGIN
	SELECT email, fname FROM user WHERE username = u;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getRandomQuiz` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getRandomQuiz`(IN num INT)
BEGIN
	DECLARE N TINYINT DEFAULT 3;

	IF (num <=> 1) THEN
		(SELECT phrases FROM dragdrop ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrases FROM fingerspelling ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrases FROM fingerspellinginterp ORDER BY RAND() LIMIT N)
        UNION
        (SELECT questions FROM multiplechoice ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrase FROM webcam ORDER BY RAND() LIMIT N) ORDER BY RAND();
    ELSEIF (num <=> 2) THEN
		(SELECT phrases FROM dragdropnumbers ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrases FROM fingerspellingnumbers ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrases FROM fingerspellinginterpnumbers ORDER BY RAND() LIMIT N)
        UNION
        (SELECT questions FROM multiplechoicenumbers ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrase FROM webcamnumbers ORDER BY RAND() LIMIT N) ORDER BY RAND();
    ELSEIF (num <=> 3) THEN
		(SELECT phrases FROM dragdropquestions ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrases FROM selectquestions ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrases FROM fingerspellinginterpquestions ORDER BY RAND() LIMIT N)
        UNION
        (SELECT questions FROM multiplechoicequestions ORDER BY RAND() LIMIT N)
        UNION
        (SELECT phrase FROM webcamquestions ORDER BY RAND() LIMIT N) ORDER BY RAND();
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getUserLesson` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getUserLesson`(IN id INT, IN num INT)
BEGIN
	SET SESSION group_concat_max_len = 1000000;

	SELECT
		CONCAT(l.desc, "-", lec.progress) as PID,
		CONCAT(prac.id, "-", prac.progress, "-", prac.complete) as answers,
		q.last_grade as phrases
	FROM
		user_has_lesson as uhl
		INNER JOIN lesson as l ON uhl.lesson_id = l.id
		INNER JOIN lecture as lec ON uhl.lecture_id = lec.id
		INNER JOIN practice as prac ON uhl.practice_id = prac.id
		INNER JOIN quiz as q ON uhl.quiz_id = q.id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phdd.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phdd.answers, '{"answers": null}') ORDER BY phdd.dragdrop_id) as answers,
	GROUP_CONCAT(dd.phrases, '--', dd.id ORDER BY dd.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_dragdrop as phdd ON phdd.practice_id = prac.id
		INNER JOIN dragdrop as dd ON dd.id = phdd.dragdrop_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phfs.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phfs.answers, '{"answers": null}') ORDER BY phfs.fingerspelling_id) as answers,
	GROUP_CONCAT(fs.phrases, '--', fs.id ORDER BY fs.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_fingerspelling as phfs ON phfs.practice_id = prac.id
		INNER JOIN fingerspelling as fs ON fs.id = phfs.fingerspelling_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phfsi.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phfsi.answers, '{"answers": null}') ORDER BY phfsi.fingerspellinginterp_id) as answers,
	GROUP_CONCAT(fsi.phrases, '--', fsi.id ORDER BY fsi.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_fingerspellinginterp as phfsi ON phfsi.practice_id = prac.id
		INNER JOIN fingerspellinginterp as fsi ON fsi.id = phfsi.fingerspellinginterp_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phmc.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phmc.answers, '{"answers": null}') ORDER BY phmc.multiplechoice_id) as answers,
	GROUP_CONCAT(mc.questions, '--', mc.id ORDER BY mc.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_multiplechoice as phmc ON phmc.practice_id = prac.id
		INNER JOIN multiplechoice as mc ON mc.id = phmc.multiplechoice_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phwc.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phwc.prediction, '{"answers": null}') ORDER BY phwc.webcam_id) as answers,
	GROUP_CONCAT(wc.phrase, '--', wc.id ORDER BY wc.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_webcam as phwc ON phwc.practice_id = prac.id
		INNER JOIN webcam as wc ON wc.id = phwc.webcam_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phddn.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phddn.answers, '{"answers": null}') ORDER BY phddn.dragdropnumbers_id) as answers,
	GROUP_CONCAT(ddn.phrases, '--', ddn.id ORDER BY ddn.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_dragdropnumbers as phddn ON phddn.practice_id = prac.id
		INNER JOIN dragdropnumbers as ddn ON ddn.id = phddn.dragdropnumbers_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phfsn.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phfsn.answers, '{"answers": null}') ORDER BY phfsn.fingerspellingnumbers_id) as answers,
	GROUP_CONCAT(fsn.phrases, '--', fsn.id ORDER BY fsn.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_fingerspellingnumbers as phfsn ON phfsn.practice_id = prac.id
		INNER JOIN fingerspellingnumbers as fsn ON fsn.id = phfsn.fingerspellingnumbers_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phfsin.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phfsin.answers, '{"answers": null}') ORDER BY phfsin.fingerspellinginterpnumbers_id) as answers,
	GROUP_CONCAT(fsin.phrases, '--', fsin.id ORDER BY fsin.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_fingerspellinginterpnumbers as phfsin ON phfsin.practice_id = prac.id
		INNER JOIN fingerspellinginterpnumbers as fsin ON fsin.id = phfsin.fingerspellinginterpnumbers_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phsq.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phsq.answers, '{"answers": null}') ORDER BY phsq.selectquestions_id) as answers,
	GROUP_CONCAT(sq.phrases, '--', sq.id ORDER BY sq.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_selectquestions as phsq ON phsq.practice_id = prac.id
		INNER JOIN selectquestions as sq ON sq.id = phsq.selectquestions_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phddq.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phddq.answers, '{"answers": null}') ORDER BY phddq.dragdropquestions_id) as answers,
	GROUP_CONCAT(ddq.phrases, '--', ddq.id ORDER BY ddq.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_dragdropquestions as phddq ON phddq.practice_id = prac.id
		INNER JOIN dragdropquestions as ddq ON ddq.id = phddq.dragdropquestions_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phfsiq.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phfsiq.answers, '{"answers": null}') ORDER BY phfsiq.fingerspellinginterpquestions_id) as answers,
	GROUP_CONCAT(fsiq.phrases, '--', fsiq.id ORDER BY fsiq.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_fingerspellinginterpquestions as phfsiq ON phfsiq.practice_id = prac.id
		INNER JOIN fingerspellinginterpquestions as fsiq ON fsiq.id = phfsiq.fingerspellinginterpquestions_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num


	UNION
	SELECT phmcn.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phmcn.answers, '{"answers": null}') ORDER BY phmcn.multiplechoicenumbers_id) as answers,
	GROUP_CONCAT(mcn.questions, '--', mcn.id ORDER BY mcn.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_multiplechoicenumbers as phmcn ON phmcn.practice_id = prac.id
		INNER JOIN multiplechoicenumbers as mcn ON mcn.id = phmcn.multiplechoicenumbers_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phmcq.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phmcq.answers, '{"answers": null}') ORDER BY phmcq.multiplechoicequestions_id) as answers,
	GROUP_CONCAT(mcq.questions, '--', mcq.id ORDER BY mcq.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_multiplechoicequestions as phmcq ON phmcq.practice_id = prac.id
		INNER JOIN multiplechoicequestions as mcq ON mcq.id = phmcq.multiplechoicequestions_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phwcn.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phwcn.prediction, '{"answers": null}') ORDER BY phwcn.webcamnumbers_id) as answers,
	GROUP_CONCAT(wcn.phrase, '--', wcn.id ORDER BY wcn.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_webcamnumbers as phwcn ON phwcn.practice_id = prac.id
		INNER JOIN webcamnumbers as wcn ON wcn.id = phwcn.webcamnumbers_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num
	UNION
	SELECT phwcq.practice_id as PID, 
	GROUP_CONCAT(IFNULL(phwcq.prediction, '{"answers": null}') ORDER BY phwcq.webcamquestions_id) as answers,
	GROUP_CONCAT(wcq.phrase, '--', wcq.id ORDER BY wcq.id SEPARATOR ' | ') as phrases
		FROM user_has_lesson as uhl
		INNER JOIN practice as prac ON prac.id = uhl.practice_id
		INNER JOIN practice_has_webcamquestions as phwcq ON phwcq.practice_id = prac.id
		INNER JOIN webcamquestions as wcq ON wcq.id = phwcq.webcamquestions_id
		WHERE uhl.user_id = id AND uhl.lesson_id = num;



	#SELECT
    #l.desc as description,
    #lec.progress as lecture_progress, 
    #prac.id as practice_id,
	#prac.progress as practice_progress,
    #prac.complete as practice_complete,
    #q.complete as quiz_complete,
    
    #GROUP_CONCAT(DISTINCT phdd.answers ORDER BY phdd.dragdrop_id) as dragdrop_answers,
    #GROUP_CONCAT(DISTINCT dd.phrases, '-', dd.id ORDER BY dd.id SEPARATOR ' | ') as dragdrop_phrases,
    
    #GROUP_CONCAT(DISTINCT phfs.answers ORDER BY phfs.fingerspelling_id) as fingerspelling_answers,
    #GROUP_CONCAT(DISTINCT fs.phrases, '-', fs.id ORDER BY fs.id SEPARATOR ' | ') as fingerspelling_phrases,
    
    #GROUP_CONCAT(DISTINCT phfsi.answers ORDER BY phfsi.fingerspellinginterp_id) as fingerspellinginterp_answers,
    #GROUP_CONCAT(DISTINCT fsi.phrases, '-', fsi.id ORDER BY fsi.id SEPARATOR ' | ') as fingerspellinginterp_phrases,
    
    #GROUP_CONCAT(DISTINCT phmc.answers ORDER BY phmc.multiplechoice_id) as multiplechoice_answers,
    #GROUP_CONCAT(DISTINCT mc.questions, '-', mc.id ORDER BY mc.id SEPARATOR ' | ') as multiplechoice_questions,
    
    #GROUP_CONCAT(DISTINCT phwc.prediction ORDER BY phwc.webcam_id) as webcam_prediction,
    #GROUP_CONCAT(DISTINCT wc.phrase, '-', wc.id ORDER BY wc.id SEPARATOR ' | ') as webcam_phrase
    
    #FROM user as u
    #INNER JOIN user_has_lesson as uhl ON u.id = uhl.user_id AND uhl.lesson_id = num
    #INNER JOIN lesson as l ON uhl.lesson_id = l.id
    #INNER JOIN lecture as lec ON uhl.lecture_id = lec.id
    #INNER JOIN practice as prac ON uhl.practice_id = prac.id
    #INNER JOIN quiz as q ON uhl.quiz_id = q.id
    
    #INNER JOIN practice_has_dragdrop as phdd ON prac.id = phdd.practice_id
    #INNER JOIN dragdrop as dd ON phdd.dragdrop_id = dd.id
    
    #INNER JOIN practice_has_fingerspelling as phfs ON prac.id = phfs.practice_id
    #INNER JOIN fingerspelling as fs ON phfs.fingerspelling_id = fs.id
    
    #INNER JOIN practice_has_fingerspellinginterp as phfsi ON prac.id = phfsi.practice_id
    #INNER JOIN fingerspellinginterp as fsi ON phfsi.fingerspellinginterp_id = fsi.id
    
    #INNER JOIN practice_has_multiplechoice as phmc ON prac.id = phmc.practice_id
    #INNER JOIN multiplechoice as mc ON phmc.multiplechoice_id = mc.id
    
    #INNER JOIN practice_has_webcam as phwc ON prac.id = phwc.practice_id
    #INNER JOIN webcam as wc ON phwc.webcam_id = wc.id
    
    #WHERE u.id = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getUserLessonInfo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getUserLessonInfo`(IN id INT)
BEGIN
	SELECT
		uhl.lesson_id, uhl.unlock_date,
        l.desc,
        prac.complete as practice_complete,
        q.passed as quiz_passed, q.last_score, q.last_grade, q.last_time
	FROM
		user_has_lesson as uhl
		INNER JOIN lesson as l ON uhl.lesson_id = l.id
		INNER JOIN lecture as lec ON uhl.lecture_id = lec.id
		INNER JOIN practice as prac ON uhl.practice_id = prac.id
		INNER JOIN quiz as q ON uhl.quiz_id = q.id
	WHERE uhl.user_id = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `incrementLoginAttempt` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
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
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Login`(IN e VARCHAR(255), IN ext_id VARCHAR(64))
BEGIN
	CALL duohando.findUserProc(e, ext_ID);
	CALL duohando.setLoginAttempt(e, 0);
	UPDATE user SET last_login = NOW() WHERE email = e;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Register` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Register`(
	IN fn VARCHAR(30), IN ln VARCHAR(30),
	IN e VARCHAR(255), IN u VARCHAR(50),
    IN tf_s VARCHAR(32), IN ev_s VARCHAR(128),
	IN pass_hash VARCHAR(64),
	IN ext_type VARCHAR(8), IN ext_ID VARCHAR(64)
)
BEGIN
	#username for external accounts
	DECLARE user_name VARCHAR(50);
    
	IF (ISNULL(ext_type)) THEN
		INSERT INTO user(fname, lname, email, username, twofactor_secret, emailverify_secret, password_hash) 
        VALUES (fn, ln, e, u, tf_s, ev_s, pass_hash);
    ELSE
		#external accounts are automatically verified
        SET user_name = CONCAT("user", (SELECT IFNULL(MAX(id)+1, 1) FROM user));
		INSERT INTO user(fname, lname, email, username, twofactor_secret, external_type, external_id, verified) 
        VALUES (fn, ln, e, user_name, tf_s, ext_type, ext_ID, 1);
	END IF;
    
	CALL findUserProc(e, ext_ID);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setLectureProgress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setLectureProgress`(IN e VARCHAR(255), IN ext_id VARCHAR(64), IN p TINYINT, IN l TINYINT)
BEGIN
	DECLARE u_id INT;
	IF (ISNULL(ext_id)) THEN
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id IS NULL);
	ELSE 
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id = ext_id);
    END IF;
    
    UPDATE lecture as lec 
    SET lec.progress = p 
    WHERE lec.id = (SELECT uhl.lecture_id FROM user_has_lesson as uhl WHERE uhl.user_id = u_id AND uhl.lesson_id = l);
    
    CALL findUserProc(e, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setLoginAttempt` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
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
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setPracticeAnswer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setPracticeAnswer`(IN prac_id INT, IN ans_id INT, IN ans JSON, IN type VARCHAR(30))
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";

	IF (type <=> "DragDrop") THEN
        UPDATE practice_has_dragdrop SET answers = ans WHERE practice_id = prac_id AND dragdrop_id = ans_id;
	ELSEIF (type <=> "DragDropNumbers") THEN
        UPDATE practice_has_dragdropnumbers SET answers = ans WHERE practice_id = prac_id AND dragdropnumbers_id = ans_id;
	ELSEIF (type <=> "DragDropQuestions") THEN
        UPDATE practice_has_dragdropquestions SET answers = ans WHERE practice_id = prac_id AND dragdropquestions_id = ans_id;
    ELSEIF (type <=> "FingerSpelling") THEN
		UPDATE practice_has_fingerspelling SET answers = ans WHERE practice_id = prac_id AND fingerspelling_id = ans_id;
	ELSEIF (type <=> "FingerSpellingNumbers") THEN
		UPDATE practice_has_fingerspellingnumbers SET answers = ans WHERE practice_id = prac_id AND fingerspellingnumbers_id = ans_id;
	ELSEIF (type <=> "FingerSpellingInterp") THEN
		UPDATE practice_has_fingerspellinginterp SET answers = ans WHERE practice_id = prac_id AND fingerspellinginterp_id = ans_id;
	ELSEIF (type <=> "FingerSpellingInterpNumbers") THEN
		UPDATE practice_has_fingerspellinginterpnumbers SET answers = ans WHERE practice_id = prac_id AND fingerspellinginterpnumbers_id = ans_id;
	ELSEIF (type <=> "FingerSpellingInterpQuestions") THEN
		UPDATE practice_has_fingerspellinginterpquestions SET answers = ans WHERE practice_id = prac_id AND fingerspellinginterpquestions_id = ans_id;
	ELSEIF (type <=> "SelectQuestions") THEN
		UPDATE practice_has_selectquestions SET answers = ans WHERE practice_id = prac_id AND selectquestions_id = ans_id;
	ELSEIF (type <=> "MultipleChoice") THEN
		UPDATE practice_has_multiplechoice SET answers = ans WHERE practice_id = prac_id AND multiplechoice_id = ans_id;
	ELSEIF (type <=> "MultipleChoiceNumbers") THEN
		UPDATE practice_has_multiplechoicenumbers SET answers = ans WHERE practice_id = prac_id AND multiplechoicenumbers_id = ans_id;
	ELSEIF (type <=> "MultipleChoiceQuestions") THEN
		UPDATE practice_has_multiplechoicequestions SET answers = ans WHERE practice_id = prac_id AND multiplechoicequestions_id = ans_id;
	ELSEIF (type <=> "WebCam") THEN
		UPDATE practice_has_webcam SET prediction = ans WHERE practice_id = prac_id AND webcam_id = ans_id;
	ELSEIF (type <=> "WebCamNumbers") THEN
		UPDATE practice_has_webcamnumbers SET prediction = ans WHERE practice_id = prac_id AND webcamnumbers_id = ans_id;
	ELSEIF (type <=> "WebCamQuestions") THEN
		UPDATE practice_has_webcamquestions SET prediction = ans WHERE practice_id = prac_id AND webcamquestions_id = ans_id;
	ELSE
		SET err = CONCAT(type, " isn't a valid practice type");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    
    SELECT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setPracticeComplete` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setPracticeComplete`(IN e VARCHAR(255), IN ext_id VARCHAR(64), IN l TINYINT)
BEGIN
	DECLARE u_id INT;
	IF (ISNULL(ext_id)) THEN
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id IS NULL);
	ELSE 
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id = ext_id);
    END IF;

    UPDATE practice as p 
    SET p.complete = 1 
    WHERE p.id = (SELECT uhl.practice_id FROM user_has_lesson as uhl WHERE uhl.user_id = u_id AND uhl.lesson_id = l);
    
    CALL findUserProc(e, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setPracticeProgress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setPracticeProgress`(IN e VARCHAR(255), IN ext_id VARCHAR(64), IN p TINYINT, IN l TINYINT)
BEGIN
	DECLARE u_id INT;
	IF (ISNULL(ext_id)) THEN
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id IS NULL);
	ELSE 
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id = ext_id);
    END IF;
    
    UPDATE practice as prac 
    SET prac.progress = p 
    WHERE prac.id = (SELECT uhl.practice_id FROM user_has_lesson as uhl WHERE uhl.user_id = u_id AND uhl.lesson_id = l);
    
    CALL findUserProc(e, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setQuizInfo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setQuizInfo`(IN e VARCHAR(255), IN ext_id VARCHAR(64), IN l TINYINT, IN g INT, IN s INT, IN t JSON)
BEGIN
	DECLARE u_id INT;
    DECLARE quiz_complete TINYINT;
    
	IF (ISNULL(ext_id)) THEN
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id IS NULL);
	ELSE 
		SET u_id = (SELECT id FROM user WHERE email = e AND external_id = ext_id);
    END IF;
    
	SET quiz_complete = (SELECT q.passed 
							FROM quiz as q
                            INNER JOIN user_has_lesson as uhl ON uhl.quiz_id = q.id
                            WHERE uhl.user_id = u_id AND uhl.lesson_id = l);
    IF (g >= 70) THEN
		IF (quiz_complete != 1) THEN 
			UPDATE quiz as q 
			SET q.passed = 1 
			WHERE q.id = (SELECT uhl.quiz_id FROM user_has_lesson as uhl WHERE uhl.user_id = u_id AND uhl.lesson_id = l);
			
			CALL addLesson(e, ext_id);
		END IF;
        
        UPDATE quiz as q 
		SET q.last_grade = g, q.last_score = s, q.last_time = t
		WHERE q.id = (SELECT uhl.quiz_id FROM user_has_lesson as uhl WHERE uhl.user_id = u_id AND uhl.lesson_id = l);
        
        CALL findUserProc(e, ext_id);
	ELSE
		CALL findUserProc(e, ext_id);
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setRandomPractice` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setRandomPractice`(IN pid INT, IN num INT)
BEGIN
	DECLARE MAX INT;
	DECLARE UPPER_A INT; DECLARE LOWER_A INT;
    DECLARE UPPER_B INT; DECLARE LOWER_B INT;
    DECLARE UPPER_C INT; DECLARE LOWER_C INT;

	IF (num <=> 1) THEN
		DELETE FROM practice_has_dragdrop WHERE practice_id = pid;
        DELETE FROM practice_has_fingerspelling WHERE practice_id = pid;
        DELETE FROM practice_has_fingerspellinginterp WHERE practice_id = pid;
        DELETE FROM practice_has_multiplechoice WHERE practice_id = pid;
        DELETE FROM practice_has_webcam WHERE practice_id = pid;
    
		SET MAX = (SELECT MAX(id) FROM dragdrop);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_dragdrop (practice_id, dragdrop_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
		
        SET MAX = (SELECT MAX(id) FROM fingerspelling);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_fingerspelling (practice_id, fingerspelling_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
            
		SET MAX = (SELECT MAX(id) FROM fingerspellinginterp);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_fingerspellinginterp (practice_id, fingerspellinginterp_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
		
        SET MAX = (SELECT MAX(id) FROM multiplechoice);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_multiplechoice (practice_id, multiplechoice_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
            
		SET MAX = (SELECT MAX(id) FROM webcam);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_webcam (practice_id, webcam_id, prediction) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);

    ELSEIF (num <=> 2) THEN
		SET MAX = (SELECT MAX(id) FROM dragdropnumbers);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_dragdropnumbers (practice_id, dragdropnumbers_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
		
        SET MAX = (SELECT MAX(id) FROM fingerspellingnumbers);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_fingerspellingnumbers (practice_id, fingerspellingnumbers_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
            
		SET MAX = (SELECT MAX(id) FROM fingerspellinginterpnumbers);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_fingerspellinginterpnumbers (practice_id, fingerspellinginterpnumbers_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
		
        SET MAX = (SELECT MAX(id) FROM multiplechoicenumbers);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_multiplechoicenumbers (practice_id, multiplechoicenumbers_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
            
		SET MAX = (SELECT MAX(id) FROM webcamnumbers);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_webcamnumbers (practice_id, webcamnumbers_id, prediction) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);

    ELSEIF (num <=> 3) THEN
		SET MAX = (SELECT MAX(id) FROM dragdropquestions);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_dragdropquestions (practice_id, dragdropquestions_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
            
		SET MAX = (SELECT MAX(id) FROM fingerspellinginterpquestions);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_fingerspellinginterpquestions (practice_id, fingerspellinginterpquestions_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
            
		SET MAX = (SELECT MAX(id) FROM selectquestions);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_selectquestions (practice_id, selectquestions_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
		
        SET MAX = (SELECT MAX(id) FROM multiplechoicequestions);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_multiplechoicequestions (practice_id, multiplechoicequestions_id, answers) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
            
		SET MAX = (SELECT MAX(id) FROM webcamquestions);
		SET UPPER_A = FLOOR(MAX/3); SET LOWER_A = 1;
        IF (MAX % 3 <=> 0) THEN
			SET UPPER_B = MAX-(MAX/3); SET LOWER_B = (MAX/3)+1;
        ELSE
			SET UPPER_B = MAX-Floor(MAX/3); SET LOWER_B = CEIL(MAX/3);
        END IF;
        SET UPPER_C = MAX; SET LOWER_C = (MAX-FLOOR(MAX/3)+1);
        INSERT INTO practice_has_webcamquestions (practice_id, webcamquestions_id, prediction) VALUES
			(pid, (SELECT (FLOOR(RAND()*(UPPER_A-LOWER_A+1)+LOWER_A))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_B-LOWER_B+1)+LOWER_B))), DEFAULT),
            (pid, (SELECT (FLOOR(RAND()*(UPPER_C-LOWER_C+1)+LOWER_C))), DEFAULT);
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `verifyDisableSecret` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
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
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Disable verification type not found.";
        END IF;
        IF (NOW() < (last_change + INTERVAL 1 HOUR)) THEN
			UPDATE user SET disabled = 1, disable_secret = NULL WHERE email = e AND external_id IS NULL AND disable_secret = d_s;
        ELSE
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Disable token expired. You will have to request a new email to be sent.";
        END IF;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Unknown disable token. It either never existed, or has already been used.";
    END IF;

	CALL findUserProc(e, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `verifyEmailSecret` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `verifyEmailSecret`(IN ev_s CHAR(128))
BEGIN
	DECLARE err VARCHAR(50) DEFAULT "Error";

	DECLARE e VARCHAR(255);
    DECLARE ext_id VARCHAR(64);
    DECLARE last_change TIMESTAMP;
    SET e = (SELECT email FROM user WHERE emailverify_secret = ev_s);
    SET ext_id = (SELECT external_id FROM user WHERE email = e AND emailverify_secret = ev_s);
    
    #external accounts don't need email verification
    IF (NOT ISNULL(ext_id)) THEN
		SET err = CONCAT(e, " tried to verify email secret of external account");
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = err;
    END IF;
    IF (NOT ISNULL(e)) THEN
        SET last_change = (SELECT last_email_change FROM user WHERE email = e AND external_id IS NULL AND emailverify_secret = ev_s);
        IF (NOW() < (last_change + INTERVAL 1 HOUR)) THEN
			UPDATE user SET verified = 1, emailverify_secret = NULL WHERE email = e AND external_id IS NULL AND emailverify_secret = ev_s;
        ELSE
			#only delete users if they were just created
			DELETE FROM user WHERE email = e AND create_time = last_change;
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Email token expired. You will have to request a new email to be sent.";
        END IF;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Unknown email token. It either never existed, or has already been used.";
    END IF;

	CALL findUserProc(e, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `verifyPasswordSecret` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
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
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Password token expired. You will have to request a new email to be sent.";
        END IF;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Unknown password token. It either never existed, or has already been used.";
    END IF;
    
    CALL findUserProc(e, ext_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-02 13:39:23
