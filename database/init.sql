-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hostel_management_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allocations`
--

DROP TABLE IF EXISTS `allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allocations` (
  `allocation_id` int NOT NULL,
  `student_id` int NOT NULL,
  `room_id` int NOT NULL,
  `allocated_date` date NOT NULL,
  `duration_months` int NOT NULL,
  PRIMARY KEY (`allocation_id`),
  UNIQUE KEY `student_id` (`student_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `allocations_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `allocations_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allocations`
--

LOCK TABLES `allocations` WRITE;
/*!40000 ALTER TABLE `allocations` DISABLE KEYS */;
INSERT INTO `allocations` VALUES (1,1,101,'2026-10-01',6);
INSERT INTO `allocations` VALUES (2,2,102,'2026-10-01',4);
INSERT INTO `allocations` VALUES (3,3,103,'2026-10-01',5);
INSERT INTO `allocations` VALUES (4,4,101,'2026-10-01',6);
INSERT INTO `allocations` VALUES (5,8,102,'2026-10-05',6);
/*!40000 ALTER TABLE `allocations` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_update_room_occupancy` AFTER INSERT ON `allocations` FOR EACH ROW BEGIN
    UPDATE rooms
    SET occupancy = occupancy + 1
    WHERE room_id = NEW.room_id;
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
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_audit_allocations_insert` AFTER INSERT ON `allocations` FOR EACH ROW BEGIN
    INSERT INTO audit_log (
        action,
        table_name,
        record_id,
        old_value,
        new_value
    )
    VALUES (
        'INSERT',
        'allocations',
        NEW.allocation_id,
        NULL,
        CONCAT(
            'Student ID=', NEW.student_id,
            ', Room ID=', NEW.room_id,
            ', Duration=', NEW.duration_months
        )
    );
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
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_update_room_occupancy_delete` AFTER DELETE ON `allocations` FOR EACH ROW BEGIN
    UPDATE rooms
    SET occupancy = occupancy - 1
    WHERE room_id = OLD.room_id;
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
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_audit_allocations_delete` AFTER DELETE ON `allocations` FOR EACH ROW BEGIN
    INSERT INTO audit_log (
        action,
        table_name,
        record_id,
        old_value,
        new_value
    )
    VALUES (
        'DELETE',
        'allocations',
        OLD.allocation_id,
        CONCAT(
            'Student ID=', OLD.student_id,
            ', Room ID=', OLD.room_id,
            ', Duration=', OLD.duration_months
        ),
        NULL
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `audit_id` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `record_id` int DEFAULT NULL,
  `old_value` varchar(255) DEFAULT NULL,
  `new_value` varchar(255) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
INSERT INTO `audit_log` VALUES (1,'INSERT','allocations',2,NULL,'Student ID=2, Room ID=102, Duration=4','2026-10-05 04:56:37');
INSERT INTO `audit_log` VALUES (2,'INSERT','allocations',3,NULL,'Student ID=3, Room ID=103, Duration=5','2026-10-05 04:56:37');
INSERT INTO `audit_log` VALUES (3,'UPDATE','rooms',103,'Occupancy=0','Occupancy=1','2026-10-05 04:56:37');
INSERT INTO `audit_log` VALUES (4,'INSERT','allocations',4,NULL,'Student ID=4, Room ID=101, Duration=6','2026-10-05 04:56:37');
INSERT INTO `audit_log` VALUES (5,'UPDATE','rooms',101,'Occupancy=1','Occupancy=2','2026-10-05 04:56:37');
INSERT INTO `audit_log` VALUES (6,'UPDATE','rooms',201,'Occupancy=0','Occupancy=1','2026-10-05 05:09:48');
INSERT INTO `audit_log` VALUES (7,'INSERT','allocations',5,NULL,'Student ID=5, Room ID=201, Duration=6','2026-10-05 05:09:48');
INSERT INTO `audit_log` VALUES (8,'UPDATE','rooms',201,'Occupancy=1','Occupancy=0','2026-10-05 05:10:35');
INSERT INTO `audit_log` VALUES (9,'DELETE','allocations',5,'Student ID=5, Room ID=201, Duration=6',NULL,'2026-10-05 05:10:35');
INSERT INTO `audit_log` VALUES (14,'UPDATE','rooms',102,'Occupancy=1','Occupancy=2','2026-10-05 06:54:41');
INSERT INTO `audit_log` VALUES (15,'INSERT','allocations',5,NULL,'Student ID=8, Room ID=102, Duration=6','2026-10-05 06:54:41');
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostels`
--

DROP TABLE IF EXISTS `hostels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hostels` (
  `hostel_id` int NOT NULL,
  `hostel_name` varchar(100) NOT NULL,
  `hostel_type` varchar(20) NOT NULL,
  `location` varchar(100) NOT NULL,
  `monthly_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`hostel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostels`
--

LOCK TABLES `hostels` WRITE;
/*!40000 ALTER TABLE `hostels` DISABLE KEYS */;
INSERT INTO `hostels` VALUES (1,'Green Valley Hostel','Boys','Block A',5000.00);
INSERT INTO `hostels` VALUES (2,'Sunrise Hostel','Girls','Block B',5500.00);
INSERT INTO `hostels` VALUES (3,'Hill View Hostel','Boys','Block C',4500.00);
/*!40000 ALTER TABLE `hostels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL,
  `hostel_id` int NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `capacity` int NOT NULL,
  `occupancy` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`room_id`),
  KEY `hostel_id` (`hostel_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`hostel_id`) REFERENCES `hostels` (`hostel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (101,1,'A-101',4,2);
INSERT INTO `rooms` VALUES (102,1,'A-102',4,2);
INSERT INTO `rooms` VALUES (103,1,'A-103',3,1);
INSERT INTO `rooms` VALUES (201,2,'B-201',3,0);
INSERT INTO `rooms` VALUES (202,2,'B-202',4,0);
INSERT INTO `rooms` VALUES (301,3,'C-301',4,0);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_audit_room_occupancy` AFTER UPDATE ON `rooms` FOR EACH ROW BEGIN
    IF OLD.occupancy <> NEW.occupancy THEN
        INSERT INTO audit_log (
            action,
            table_name,
            record_id,
            old_value,
            new_value
        )
        VALUES (
            'UPDATE',
            'rooms',
            NEW.room_id,
            CONCAT('Occupancy=', OLD.occupancy),
            CONCAT('Occupancy=', NEW.occupancy)
        );
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `course` varchar(100) NOT NULL,
  `year` int NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Jebastine','jebastine@gmail.com','9876543210','Computer Science',3);
INSERT INTO `students` VALUES (2,'Arun','arun@gmail.com','9876543211','Information Technology',3);
INSERT INTO `students` VALUES (3,'Priya','priya@gmail.com','9876543212','Computer Science',2);
INSERT INTO `students` VALUES (4,'Rahul','rahul@gmail.com','9876543213','Information Technology',2);
INSERT INTO `students` VALUES (5,'Divya','divya@gmail.com','9876543214','Computer Science',3);
INSERT INTO `students` VALUES (6,'Karthik','karthik@gmail.com','9876543215','Electronics',3);
INSERT INTO `students` VALUES (7,'Anjali','anjali@gmail.com','9876543216','Computer Science',2);
INSERT INTO `students` VALUES (8,'Vishnu','vishnu@gmail.com','9876543217','Information Technology',3);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hostel_management_db'
--
/*!50003 DROP FUNCTION IF EXISTS `calculate_hostel_fee` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `calculate_hostel_fee`(
    p_hostel_id INT,
    p_duration_months INT
) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
    DECLARE v_monthly_fee DECIMAL(10,2);

    SELECT monthly_fee
    INTO v_monthly_fee
    FROM hostels
    WHERE hostel_id = p_hostel_id;

    IF v_monthly_fee IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Hostel not found';
    END IF;

    RETURN v_monthly_fee * p_duration_months;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `allocate_room` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `allocate_room`(
    IN p_student_id INT,
    IN p_room_id INT,
    IN p_duration_months INT
)
BEGIN
    DECLARE v_occupancy INT;
    DECLARE v_capacity INT;
    DECLARE v_student_exists INT DEFAULT 0;
    DECLARE v_allocation_exists INT DEFAULT 0;
    DECLARE v_next_allocation_id INT;

    SELECT COUNT(*)
    INTO v_student_exists
    FROM students
    WHERE student_id = p_student_id;

    IF v_student_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student does not exist';

    ELSE

        SELECT occupancy, capacity
        INTO v_occupancy, v_capacity
        FROM rooms
        WHERE room_id = p_room_id;

        IF v_occupancy IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Room does not exist';

        ELSEIF v_occupancy >= v_capacity THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Room is already full';

        ELSE

            SELECT COUNT(*)
            INTO v_allocation_exists
            FROM allocations
            WHERE student_id = p_student_id;

            IF v_allocation_exists > 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Student is already allocated to a room';

            ELSEIF p_duration_months <= 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Duration must be greater than 0 months';

            ELSE

                SELECT COALESCE(MAX(allocation_id), 0) + 1
                INTO v_next_allocation_id
                FROM allocations;

                INSERT INTO allocations (
                    allocation_id,
                    student_id,
                    room_id,
                    allocated_date,
                    duration_months
                )
                VALUES (
                    v_next_allocation_id,
                    p_student_id,
                    p_room_id,
                    CURDATE(),
                    p_duration_months
                );

            END IF;
        END IF;
    END IF;
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

-- Dump completed on 2026-10-06  9:52:08
