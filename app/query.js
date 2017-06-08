'use strict';


var path = require('path');
/*
var fs = require('fs');
*/
var util = require('util');


var hfc = require('fabric-client');
var Peer = require('fabric-client/lib/Peer.js');
var Block=require('fabric-client/lib/Block.js');
/*
 var utils = require('fabric-client/lib/utils.js');
var EventHub = require('fabric-client/lib/EventHub.js');
*/

var config = require('../config.json');
var helper = require('./helper.js');

var logger = helper.getLogger('query');


hfc.addConfigFile(path.join(__dirname, 'network-config.json'));
var ORGS = hfc.getConfigSetting('network-config');

var client = new hfc();
var chain = client.newChain(config.channelName);
chain.addOrderer(
    helper.getOrderer()
);
for (let key in ORGS) {
    if (ORGS.hasOwnProperty(key) && typeof ORGS[key].peer1 !== 'undefined') {
        let peer = new Peer(
            ORGS[key].peer1.requests
        );
        chain.addPeer(peer);
    }
}



var adminUser = null;

var org = config.orgsList[0]; // org1



var orgName = ORGS[org].name;



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
        logger.debug('===========================================');
    }).catch(err =>{
        console.info(err)
    });
}


// getChannelInfo();


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
        return chain.queryBlockByHash(new Buffer(blockHash,"hex"));
    }).then( block => {
        var b=Block.decode(block);
        // console.info(b);
        console.info('===============data=================')
        console.info(JSON.stringify(b));
        console.info(util.inspect(b))
    }).catch(err =>{
        console.info(err);
    });
}

// queryBlockByHash("5d3258accfd72541a4b47db3a4fcf5c1287541bf52faf6905e643207eb3f8d64");

function getBlockByNumber(blockNum){
    hfc.newDefaultKeyValueStore({
        path: helper.getKeyStoreForOrg('org1')
    }).then((store) => {

        client.setStateStore(store);
        return helper.getSubmitter(client, org);

    }).then((admin) => {
        adminUser = admin;
        return chain.queryInfo();
    }).then(blockchainInfo =>{
        return chain.queryBlock(blockNum);
    }).then( block => {
        var b=Block.decode(block);
        // console.info(b);
        console.info('===============data=================')
        console.info(JSON.stringify(b));
    }).catch(err =>{
        console.info(err);
    });
}

// getBlockByNumber(0);

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
        console.info(util.inspect(t))
    }).catch(err =>{
        console.info(err);
    });
}


 // getTransactionByID('5d4d960721ff8e7821d084c3450bdcd9c4294c9130f8574fef9ca2b9b869149d');


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

getChannels();


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