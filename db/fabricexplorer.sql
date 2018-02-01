SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `blocks`
-- ----------------------------
DROP TABLE IF EXISTS `blocks`;
CREATE TABLE `blocks` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `channelname` varchar(32) DEFAULT NULL,
  `blocknum` int(11) DEFAULT NULL,
  `datahash` varchar(256) DEFAULT NULL,
  `perhash` varchar(256) DEFAULT NULL,
  `txcount` int(11) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='block';

-- ----------------------------
--  Table structure for `ca`
-- ----------------------------
DROP TABLE IF EXISTS `ca`;
CREATE TABLE `ca` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `org_name` varchar(64) DEFAULT NULL,
  `ca_name` varchar(128) DEFAULT NULL,
  `ca_request` varchar(128) DEFAULT NULL,
  `ca_config_path` varchar(128) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='ca';

-- ----------------------------
--  Table structure for `chaincodes`
-- ----------------------------
DROP TABLE IF EXISTS `chaincodes`;
CREATE TABLE `chaincodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `peer_name` varchar(32) DEFAULT NULL,
  `channelname` varchar(128) DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL,
  `version` varchar(256) DEFAULT NULL,
  `path` varchar(256) DEFAULT NULL,
  `escc` varchar(32) DEFAULT NULL,
  `vscc` varchar(32) DEFAULT NULL,
  `txcount` int(11) DEFAULT '0' ,
  `ccstatus` varchar(32) DEFAULT NULL COMMENT ,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='chaincode';

-- ----------------------------
--  Table structure for `channel`
-- ----------------------------
DROP TABLE IF EXISTS `channel`;
CREATE TABLE `channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `channelname` varchar(64) DEFAULT NULL,
  `blocks` int(11) DEFAULT NULL,
  `countblocks` int(11) DEFAULT '1',
  `trans` int(11) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='channel';

-- ----------------------------
--  Table structure for `keyset`
-- ----------------------------
DROP TABLE IF EXISTS `keyset`;
CREATE TABLE `keyset` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `channelname` varchar(128) DEFAULT NULL,
  `blocknum` int(11) DEFAULT NULL,
  `blockhash` varchar(128) DEFAULT NULL,
  `transactionhash` varchar(255) DEFAULT NULL,
  `keyname` varchar(128) DEFAULT NULL,
  `isdelete` int(11) DEFAULT NULL,
  `valuess` varchar(128) DEFAULT NULL,
  `chaincode` varchar(64) DEFAULT NULL,
  `trandtstr` varchar(128) DEFAULT NULL,
  `transnums` int(11) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='keyset';

-- ----------------------------
--  Table structure for `keyset_history`
-- ----------------------------
DROP TABLE IF EXISTS `keyset_history`;
CREATE TABLE `keyset_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `channelname` varchar(128) DEFAULT NULL,
  `blocknum` int(11) DEFAULT NULL,
  `blockhash` varchar(128) DEFAULT NULL,
  `transactionhash` varchar(255) DEFAULT NULL,
  `keyname` varchar(128) DEFAULT NULL,
  `valuess` varchar(128) DEFAULT NULL,
  `trandtstr` varchar(64) DEFAULT NULL,
  `chaincode` varchar(64) DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='keyset_history';

-- ----------------------------
--  Table structure for `orderer`
-- ----------------------------
DROP TABLE IF EXISTS `orderer`;
CREATE TABLE `orderer` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `blocknum` int(11) DEFAULT NULL,
  `datahash` varchar(256) DEFAULT NULL,
  `orderer_config` varchar(128) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='orderer';

-- ----------------------------
--  Table structure for `org`
-- ----------------------------
DROP TABLE IF EXISTS `org`;
CREATE TABLE `org` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(128) DEFAULT NULL,
  `mspid` varchar(128) DEFAULT NULL,
  `adminkey` varchar(256) DEFAULT NULL,
  `admincert` varchar(256) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='org';

-- ----------------------------
--  Table structure for `org_ref_channel`
-- ----------------------------
DROP TABLE IF EXISTS `org_ref_channel`;
CREATE TABLE `org_ref_channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` int(11) DEFAULT NULL,
  `channelid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='org_ref_channel';

-- ----------------------------
--  Table structure for `peer`
-- ----------------------------
DROP TABLE IF EXISTS `peer`;
CREATE TABLE `peer` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `mspid` varchar(128) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `requests` varchar(64) DEFAULT NULL,
  `events` varchar(64) DEFAULT NULL,
  `peer_config` varchar(128) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='peer';

-- ----------------------------
--  Table structure for `peer_ref_channel`
-- ----------------------------
DROP TABLE IF EXISTS `peer_ref_channel`;
CREATE TABLE `peer_ref_channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `peer_name` varchar(64) DEFAULT NULL,
  `channelname` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='peer_ref_channel';

-- ----------------------------
--  Table structure for `transaction`
-- ----------------------------
DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `channelname` varchar(128) DEFAULT NULL,
  `blocknum` varchar(128) DEFAULT NULL,
  `blockhash` varchar(128) DEFAULT NULL,
  `txhash` varchar(256) DEFAULT NULL,
  `txcreatedt` datetime DEFAULT NULL,
  `chaincodename` varchar(255) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='transactions';

-- ----------------------------
--  Table structure for `write_lock`
-- ----------------------------
DROP TABLE IF EXISTS `write_lock`;
CREATE TABLE `write_lock` (
  `write_lock` int(1) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`write_lock`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='write_lock';

SET FOREIGN_KEY_CHECKS = 1;
