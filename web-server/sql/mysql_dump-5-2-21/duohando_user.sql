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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fname` varchar(30) COLLATE utf8_bin NOT NULL,
  `lname` varchar(30) COLLATE utf8_bin NOT NULL,
  `email` varchar(255) COLLATE utf8_bin NOT NULL,
  `old_email` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `username` varchar(50) COLLATE utf8_bin NOT NULL,
  `last_email_change` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `twofactor_secret` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `emailverify_secret` varchar(128) COLLATE utf8_bin DEFAULT NULL,
  `password_hash` varchar(72) COLLATE utf8_bin DEFAULT NULL,
  `passwordchange_secret` varchar(128) COLLATE utf8_bin DEFAULT NULL,
  `last_password_change` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `login_attempts` tinyint unsigned DEFAULT '0',
  `last_login` timestamp NULL DEFAULT NULL,
  `disabled` tinyint NOT NULL DEFAULT '0',
  `disable_secret` varchar(128) COLLATE utf8_bin DEFAULT NULL,
  `verified` tinyint NOT NULL DEFAULT '0',
  `external_type` varchar(8) COLLATE utf8_bin DEFAULT NULL,
  `external_id` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `external_id_UNIQUE` (`external_id`),
  UNIQUE KEY `emailverify_secret_UNIQUE` (`emailverify_secret`),
  UNIQUE KEY `twofactor_secret_UNIQUE` (`twofactor_secret`),
  UNIQUE KEY `disable_secret_UNIQUE` (`disable_secret`),
  UNIQUE KEY `old_email_UNIQUE` (`old_email`),
  UNIQUE KEY `passwordchange_secret_UNIQUE` (`passwordchange_secret`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `user_AFTER_INSERT` AFTER INSERT ON `user` FOR EACH ROW BEGIN
	INSERT INTO lecture (id) VALUES (DEFAULT);
    INSERT INTO practice (id) VALUES (DEFAULT);
    INSERT INTO quiz (id) VALUES (DEFAULT);

	INSERT INTO user_has_lesson (user_id, lesson_id, lecture_id, practice_id, quiz_id) VALUES 
    (NEW.id, 1, (SELECT MAX(id) FROM lecture), (SELECT MAX(id) FROM practice), (SELECT MAX(id) FROM quiz));
    
    CALL setRandomPractice((SELECT MAX(id) FROM practice), 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `user_BEFORE_DELETE` BEFORE DELETE ON `user` FOR EACH ROW BEGIN
	DELETE FROM user_has_lesson WHERE OLD.id = user_has_lesson.user_id;
END */;;
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

-- Dump completed on 2021-05-02 13:39:21
