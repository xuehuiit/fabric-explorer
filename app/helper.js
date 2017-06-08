/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('Helper');

var path = require('path');
var util = require('util');
var fs = require('fs');
var User = require('fabric-client/lib/User.js');
var utils = require('fabric-client/lib/utils.js');
var Orderer = require('fabric-client/lib/Orderer.js');
var copService = require('fabric-ca-client/lib/FabricCAClientImpl.js');

var config = require('../config.json');
var hfc = require('fabric-client');
hfc.addConfigFile(path.join(__dirname, 'network-config.json'));
var ORGS = hfc.getConfigSetting('network-config');

logger.setLevel('DEBUG');

module.exports.getSubmitter = function(client, userOrg) {
	var caUrl = ORGS[userOrg].ca;
	var users = config.users;
	var username = users[0].username;
	var password = users[0].secret;
	var member;
	return client.getUserContext(username,true)
		.then((user) => {
			if (user && user.isEnrolled()) {
				logger.info('Successfully loaded member from persistence');
				return user;
			} else {
				// need to enroll it with CA server
				var ca_client = new copService(caUrl);
				// need to enroll it with CA server
				return ca_client.enroll({
					enrollmentID: username,
					enrollmentSecret: password
				}).then((enrollment) => {
					logger.info('Successfully enrolled user \'' + username + '\'');

					member = new User(username, client);
					return member.setEnrollment(enrollment.key, enrollment.certificate, ORGS[userOrg].mspid);
				}).then(() => {
					return client.setUserContext(member);
				}).then(() => {
					return member;
				}).catch((err) => {
					logger.error('Failed to enroll and persist user. Error: ' + err.stack ? err.stack : err);
					throw new Error('Failed to obtain an enrolled user');
				});
			}
		});
};

module.exports.setupChaincodeDeploy = function() {
	process.env.GOPATH = path.join(__dirname, config.GOPATH);
};

module.exports.getLogger = function(moduleName) {
	var logger = log4js.getLogger(moduleName);
	logger.setLevel('DEBUG');
	return logger;
}

module.exports.getOrgName = function(org) {
	return ORGS[org].name;
}

module.exports.getOrderer = function(client, org) {
	return new Orderer(ORGS.orderer.url);
}

module.exports.getKeyStoreForOrg = function(org) {
	return config.keyValueStore + '_' + org;
};

module.exports.getArgs = function(chaincodeArgs) {
	var args = [];
	for (var i = 0; i < chaincodeArgs.length; i++) {
		args.push(chaincodeArgs[i]);
	}
	return args;
};

module.exports.getTxId = function() {
	return utils.buildTransactionID({
		length: 12
	});
};
