SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nodejs_test`
--

-- --------------------------------------------------------

--
-- Stable structure `checkpoint`
--
DROP TABLE IF EXISTS `action`;
DROP TABLE IF EXISTS `beacon`;
DROP TABLE IF EXISTS `checkpoint`;

CREATE TABLE IF NOT EXISTS `checkpoint` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table`checkpoint`
--
INSERT INTO `checkpoint` VALUES (1,'North exit checkpoint');
--
-- Stable structure `beacon`
--


CREATE TABLE IF NOT EXISTS `beacon` (
  `id` int(8) NOT NULL,
  `name` varchar(200) NOT NULL,
  `checkpoint_id` int(8) NOT NULL,
  `pos_longitude` varchar(25),
  `pos_latitude` varchar(25),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`checkpoint_id`) REFERENCES `checkpoint` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table`beacon`
--
INSERT INTO `beacon` VALUES (44422,'North exit_1',1, NULL, NULL);

--
-- Stable structure `action`
--


CREATE TABLE IF NOT EXISTS `action` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(8) NOT NULL,
  `beacon_id` int(8) NOT NULL,
  `checkpoint_id` int(8) NOT NULL,
  `event_assoc_id` int(16) NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `first_name` varchar(20),
  `last_name` varchar(20),
  `team_name` varchar(30),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`beacon_id`) REFERENCES `beacon` (`id`),
  FOREIGN KEY (`checkpoint_id`) REFERENCES `checkpoint` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table`action`
--

/*INSERT INTO `action` VALUES (0,44422,12312412414,'u12132a3','Oskar', 'Lundh', 'Armada')/*;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
