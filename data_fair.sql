SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `armada_fair`
--

-- --------------------------------------------------------
DROP DATABASE IF EXISTS `armada_fair_test`;
CREATE DATABASE IF NOT EXISTS `armada_fair_test`;

USE `armada_fair_test`;


DROP TABLE IF EXISTS `beacon`;
DROP TABLE IF EXISTS `report`;
DROP TABLE IF EXISTS `hit`;
DROP TABLE IF EXISTS `checkpoint`;
DROP TABLE IF EXISTS `company`;
DROP TABLE IF EXISTS `map`;
DROP TABLE IF EXISTS `user`;


CREATE TABLE IF NOT EXISTS `map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `map_name` varchar(25) NOT NULL,
  `url` varchar(50) NOT NULL,
  `height` int(5) NOT NULL,
  `width` int(5) NOT NULL,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(5) NOT NULL,
  `company_name` varchar(30) NOT NULL,
  `location` POINT,
  `map` int(11),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`map`) REFERENCES `map` (`id`)
)ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50),
  `user_programme` varchar(50),
  `user_email` varchar(50),
  PRIMARY KEY (`user_id`)
)ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

--
-- Stable structure `checkpoint`
--

CREATE TABLE IF NOT EXISTS `checkpoint` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

--
-- Dumping data for table`checkpoint`
--
--
-- Stable structure `beacon`
--


CREATE TABLE IF NOT EXISTS `beacon` (
  `id` int(8) NOT NULL,
  `name` varchar(200) NOT NULL,
  `checkpoint` int(8) NOT NULL,
  `location` POINT NOT NULL,
  `pos_longitude` varchar(25),
  `pos_latitude` varchar(25),
  `map` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`map`) REFERENCES `map` (`id`),
  FOREIGN KEY (`checkpoint`) REFERENCES `checkpoint` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

--
-- Dumping data for table`beacon`
--

--
-- Stable structure `hit`
--

CREATE TABLE IF NOT EXISTS `report` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `location` POINT NOT NULL,
  `map` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user`) REFERENCES `user` (`user_id`),
  FOREIGN KEY (`map`) REFERENCES `map` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `hit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `report` int(11) NOT NULL,
  `beacon` int(11) NOT NULL,
  `checkpoint` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`report`) REFERENCES `report` (`id`),
  FOREIGN KEY (`beacon`) REFERENCES `beacon` (`id`),
  FOREIGN KEY (`checkpoint`) REFERENCES `checkpoint` (`id`)
)ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

SHOW TABLES;
--
-- Dumping data for table`hit`
--

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
