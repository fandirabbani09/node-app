SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `All` (
);

CREATE TABLE `db_characters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `allegiance` varchar(255) DEFAULT NULL,
  `home` int(11) DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `technique` int(11) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `db_characters` VALUES(1, 'Goku', 'Sayan', 2, 3, 3, 'Goku');
INSERT INTO `db_characters` VALUES(2, 'Piccolo', 'Earth', 1, 1, 3, 'Piccolo');
INSERT INTO `db_characters` VALUES(3, 'Gohan', 'Sayan', 1, 1, 2, 'Gohan');
INSERT INTO `db_characters` VALUES(5, 'Freeza', '', 3, 1, 4, 'Freeza');

CREATE TABLE `db_character_techniques` (
  `pid` int(11) NOT NULL,
  `master` int(11) DEFAULT NULL COMMENT 'Character',
  `technique` int(11) DEFAULT NULL COMMENT 'Technique'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `db_character_techniques` VALUES(1, 5, 4);
INSERT INTO `db_character_techniques` VALUES(2, 1, 1);
INSERT INTO `db_character_techniques` VALUES(3, 1, 34);
INSERT INTO `db_character_techniques` VALUES(4, 2, 4);
INSERT INTO `db_character_techniques` VALUES(5, NULL, 2);
INSERT INTO `db_character_techniques` VALUES(6, NULL, 34);
INSERT INTO `db_character_techniques` VALUES(7, 1, 4);
INSERT INTO `db_character_techniques` VALUES(8, 1, 2);
INSERT INTO `db_character_techniques` VALUES(9, 2, 1);
INSERT INTO `db_character_techniques` VALUES(10, 1, 1);
INSERT INTO `db_character_techniques` VALUES(11, 5, 2);
INSERT INTO `db_character_techniques` VALUES(12, 1, 36);
INSERT INTO `db_character_techniques` VALUES(13, 1, 1);

CREATE TABLE `db_dragonballs` (
  `id` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `possessor` int(11) DEFAULT NULL,
  `location` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `db_dragonballs` VALUES(1, 0, 1, 1);
INSERT INTO `db_dragonballs` VALUES(2, 0, 2, 2);
INSERT INTO `db_dragonballs` VALUES(3, 3, 3, 36);
INSERT INTO `db_dragonballs` VALUES(4, 0, 5, 3);
INSERT INTO `db_dragonballs` VALUES(5, 0, 1, 2);
INSERT INTO `db_dragonballs` VALUES(6, 6, 1, 1);
INSERT INTO `db_dragonballs` VALUES(7, 0, 1, 1);

CREATE TABLE `db_planets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `population` bigint(20) DEFAULT NULL,
  `language` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `db_planets` VALUES(1, 'Earth', 7000000000, 'English');
INSERT INTO `db_planets` VALUES(2, 'Vegeta', 26000000, 'Unknown');
INSERT INTO `db_planets` VALUES(3, 'Namek', 5000, 'Unknown');
INSERT INTO `db_planets` VALUES(36, 'Mars', 0, 'Unknown');

CREATE TABLE `db_techniques` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `damage` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `db_techniques` VALUES(1, 'Kamehameha', 1000000);
INSERT INTO `db_techniques` VALUES(2, 'Destructo Disk', 10000);
INSERT INTO `db_techniques` VALUES(3, 'Special Beam Cannon', 500000);
INSERT INTO `db_techniques` VALUES(4, 'Galick Gun', 1000000);
INSERT INTO `db_techniques` VALUES(34, 'Super Sayan', 9000000);
INSERT INTO `db_techniques` VALUES(36, 'Test', 10);
DROP TABLE IF EXISTS `All`;

CREATE ALGORITHM=UNDEFINED DEFINER=`cs340_rabbanii`@`%` SQL SECURITY DEFINER VIEW `All`  AS  select `db_characters2`.`id` AS `id`,`db_characters2`.`name` AS `name`,`db_characters2`.`home` AS `home`,`db_characters2`.`location` AS `location`,`db_characters2`.`technique` AS `technique`,`db_characters2`.`allegiance` AS `allegiance` from `db_characters2` ;


ALTER TABLE `db_characters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Technique` (`technique`),
  ADD KEY `FK_Home` (`home`),
  ADD KEY `FK_Location` (`location`);

ALTER TABLE `db_character_techniques`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `FK_TechniqueMaster` (`master`),
  ADD KEY `FK_MasteredTechnique` (`technique`);

ALTER TABLE `db_dragonballs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Possessor` (`possessor`) USING BTREE,
  ADD KEY `FK_DragonballLocation` (`location`);

ALTER TABLE `db_planets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `db_techniques`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `db_characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `db_character_techniques`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `db_dragonballs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `db_planets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

ALTER TABLE `db_techniques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;


ALTER TABLE `db_characters`
  ADD CONSTRAINT `FK_Home` FOREIGN KEY (`home`) REFERENCES `db_planets` (`id`),
  ADD CONSTRAINT `FK_Location` FOREIGN KEY (`location`) REFERENCES `db_planets` (`id`),
  ADD CONSTRAINT `FK_Technique` FOREIGN KEY (`technique`) REFERENCES `db_techniques` (`id`);

ALTER TABLE `db_character_techniques`
  ADD CONSTRAINT `FK_MasteredTechnique` FOREIGN KEY (`technique`) REFERENCES `db_techniques` (`id`),
  ADD CONSTRAINT `FK_TechniqueMaster` FOREIGN KEY (`master`) REFERENCES `db_characters` (`id`);

ALTER TABLE `db_dragonballs`
  ADD CONSTRAINT `FK_DragonballLocation` FOREIGN KEY (`location`) REFERENCES `db_planets` (`id`),
  ADD CONSTRAINT `db_dragonballs_ibfk_1` FOREIGN KEY (`possessor`) REFERENCES `db_characters` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
