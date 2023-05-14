
--
-- Current Database: `test`
--

CREATE DATABASE  IF NOT EXISTS `test`  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci  DEFAULT ENCRYPTION='N';

USE `test`;

--
-- Table structure for table `relation`
--

DROP TABLE IF EXISTS `relation`;

CREATE TABLE `relation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `child_of` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `relation_pk` (`child_of`,`user_id`),
  KEY `relation_child_of_index` (`child_of`),
  KEY `relation_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `gender` smallint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

alter table users
  add constraint users_pk
    unique (first_name, middle_name, last_name);
