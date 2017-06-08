'use strict';


var path = require('path');
/*
var fs = require('fs');
var util = require('util');
*/


var hfc = require('fabric-client');

var Peer = require('fabric-client/lib/Peer.js');
/*
 var utils = require('fabric-client/lib/utils.js');
var EventHub = require('fabric-client/lib/EventHub.js');
*/

var config = require('../config.json');
var helper = require('./helper.js');
var logger = helper.getLogger('test');


hfc.addConfigFile(path.join(__dirname, 'network-config.json'));
var ORGS = hfc.getConfigSetting('network-config');

var Block=require('fabric-client/lib/Block.js');



var tx_id = null;
var nonce = null;
var adminUser = null;

var org = config.orgsList[0]; // org1
var client = new hfc();


var chain = client.newChain(config.channelName);

chain.addOrderer(
    helper.getOrderer()
);
var orgName = ORGS[org].name;

var targets = [];
// set up the chain to use each org's 'peer1' for
// both requests and events
for (let key in ORGS) {
    if (ORGS.hasOwnProperty(key) && typeof ORGS[key].peer1 !== 'undefined') {
        let peer = new Peer(
            ORGS[key].peer1.requests
        );
        chain.addPeer(peer);
    }
}

function getChannelInfo(){
    hfc.newDefaultKeyValueStore({
        path: helper.getKeyStoreForOrg('org1')
    }).then((store) => {

        client.setStateStore(store);
        return helper.getSubmitter(client, org);

    }).then((admin) => {
        adminUser = admin;
        return chain.queryInfo();
    }).then(blockchainInfo =>{
        logger.debug('===========================================');
        logger.debug(blockchainInfo.currentBlockHash.toString("hex"));
        logger.debug(blockchainInfo.height.toString());
        logger.debug(blockchainInfo.previousBlockHash.toString("hex"));
        logger.debug(blockchainInfo);
        logger.debug('===========================================');
    });
}


// getChannelInfo();

// console.info(Buffer.from("0xf93d73ff95760df07a86cc05cab7ce73e58d23102bd9acd245423fb0566135ef","hex"))

//f93d73ff95760df07a86cc05cab7ce73e58d23102bd9acd245423fb0566135ef
//1d4df418a55bc95028bec64749d931d3d6879f4fac767473c45535bcb9981036
function queryBlockByHash(blockHash){
    hfc.newDefaultKeyValueStore({
        path: helper.getKeyStoreForOrg('org1')
    }).then((store) => {

        client.setStateStore(store);
        return helper.getSubmitter(client, org);

    }).then((admin) => {
        adminUser = admin;
        return chain.queryInfo();
    }).then(blockchainInfo =>{
        // blockchainInfo.previousBlockHash.printDebug();
        // logger.debug(blockchainInfo.previousBlockHash.toBuffer().toString("hex"));
        return chain.queryBlockByHash(new Buffer(blockHash,"hex"));
    }).then( block => {
        console.info(block);
    }).catch(err =>{
        console.info(err);
    });
}

// queryBlockByHash("1d4df418a55bc95028bec64749d931d3d6879f4fac767473c45535bcb9981036");
function getBlockByNumber(){
    hfc.newDefaultKeyValueStore({
        path: helper.getKeyStoreForOrg('org1')
    }).then((store) => {

        client.setStateStore(store);
        return helper.getSubmitter(client, org);

    }).then((admin) => {
        adminUser = admin;
        return chain.queryInfo();
    }).then(blockchainInfo =>{
        // blockchainInfo.previousBlockHash.printDebug();
        // logger.debug(blockchainInfo.previousBlockHash.toBuffer().toString("hex"));
        return chain.queryBlock(1);
    }).then( block => {
        var b=Block.decode(block);
        // console.info(b);
        console.info('===============data=================')
        console.info(JSON.stringify(b));
    }).catch(err =>{
        console.info(err);
    });
}

// getBlockByNumber();

function getTransactionByID(txid){
    hfc.newDefaultKeyValueStore({
        path: helper.getKeyStoreForOrg('org1')
    }).then((store) => {

        client.setStateStore(store);
        return helper.getSubmitter(client, org);

    }).then((admin) => {
        adminUser = admin;
        return chain.queryInfo();
    }).then(blockchainInfo =>{
        return chain.queryTransaction(txid);
    }).then( tx => {
        var t=Block.decodeTransaction(tx);
        console.info(JSON.stringify(t));
    }).catch(err =>{
        console.info(err);
    });
}


 getTransactionByID('5d4d960721ff8e7821d084c3450bdcd9c4294c9130f8574fef9ca2b9b869149d');


function getChannels(){
    hfc.newDefaultKeyValueStore({
        path: helper.getKeyStoreForOrg('org1')
    }).then((store) => {

        client.setStateStore(store);
        return helper.getSubmitter(client, org);

    }).then((admin) => {
        adminUser = admin;
        return chain.queryInfo();
    }).then(blockchainInfo =>{
        return chain.queryChannels(new Peer('grpc://172.16.10.81:7051'));
        // return chain.queryChannels();
    }).then( ch => {
        console.info(ch);
    }).catch(err =>{
        console.info(err);
    });
}

// getChannels();


function getInstantiatedChaincodes(){
    hfc.newDefaultKeyValueStore({
        path: helper.getKeyStoreForOrg('org1')
    }).then((store) => {

        client.setStateStore(store);
        return helper.getSubmitter(client, org);

    }).then((admin) => {
        adminUser = admin;
        return chain.queryInfo();
    }).then(blockchainInfo =>{
        return chain.queryInstantiatedChaincodes();
    }).then( ch => {
        console.info(ch);
    }).catch(err =>{
        console.info(err);
    });
}

// getInstantiatedChaincodes();