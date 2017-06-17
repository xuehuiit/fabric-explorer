/**
 * Created by fengxiang on 2017/6/9.
 */

var helper=require('../app/helper.js')
var path=require('path')


var hfc = require('fabric-client');
hfc.addConfigFile(path.join(__dirname, '/app/network-config.json'));
var ORGS = hfc.getConfigSetting('network-config');

var config = require('../config.json');

var query=require('../app/query.js')



/**
 * 获取所有的组织
 */
function getAllOrgs(){
    var OrgArray=[]
    for (let key in ORGS) {
        if (key.indexOf('org') === 0) {
            let orgName = ORGS[key].name;
            OrgArray.push(orgName)
        }
    }
    return OrgArray

}

/**
 * 获取所有的peers的请求地址
 *
 * @returns {Array}
 */
function getAllPeerRequest() {

    var peerArray = []

    for (let key in ORGS) {
        if (key.indexOf('org') === 0) {
            let orgproperty = ORGS[key]
            for ( let orgkey in orgproperty){
                if(  orgkey.indexOf('peer') === 0 ){
                    var peerbean = {'name':orgkey,'org':key}
                    peerArray.push(peerbean)
                }
            }
        }
    }

    return peerArray;


}

/**
 * 获取所有的账本
 */
function getAllChannels(){


}

/**
 * 获取所有的节点
 */
function getallPeers () {

    var peerArray=[]
    for (let key in ORGS) {
        if (key.indexOf('org') === 0) {
            let peerName = ORGS[key].peer1.requests;
            peerArray.push(peerName)
        }
    }
    return peerArray

}

/**
 * 获取所有的账本
 */
function getAllChannels(){
    return config.channelsList

}

/**
 * 根据账本名称获取账本中的区块
 * @param channelname
 */
function getChainInfo( channelname ){
    return query.getChainInfo('peer1',channelname,'admin','org1')
}

/**
 * 根据区块编号获取区块详细信息
 * @param chainid
 */
function getBlock4Channel( channelName,blockNum ){
    return query.getBlockByNumber('peer1',blockNum ,'admin','org1')

}

/**
 * 获取channel中的交易
 * @param chainid
 */
function getTans4Chain( channelName,trxnID ) {
    return query.getTransactionByID('peer1',channelName, trxnID, 'admin', 'org1')

}


/**
 * 获取账本中的chaincode
 */
function getChainCode4Channel(channelName) {
    return query.getInstalledChaincodes('peer1',channelName, '', 'admin', 'org1')

}

module.exports.getAllOrgs=getAllOrgs
module.exports.getallPeers=getallPeers
module.exports.getAllPeerRequest = getAllPeerRequest
module.exports.getAllChannels=getAllChannels
module.exports.getallPeers=getallPeers
module.exports.getTans4Chain=getTans4Chain
module.exports.getChainCode4Channel=getChainCode4Channel
module.exports.getChainInfo=getChainInfo
module.exports.getBlock4Channel=getBlock4Channel

