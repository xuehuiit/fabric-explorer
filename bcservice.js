/**
 * Created by fengxiang on 2017/6/9.
 */

var helper=require('./app/helper.js')
var path=require('path')


var hfc = require('fabric-client');
hfc.addConfigFile(path.join(__dirname, '/app/network-config.json'));
var ORGS = hfc.getConfigSetting('network-config');




/**
 * 获取所有的组织
 */
module.exports.getAllOrgs= function(){
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
 * 获取所有的账本
 */
function getAllChannels(){


}


/**
 * 获取所有的节点
 */
module.exports.getallPeers=function () {

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
 * 根据账本名称获取账本中的区块
 * @param channelname
 */
function getChain4channel( channelname ){

}

/**
 * 根据区块编号获取区块详细信息
 * @param chainid
 */
function getChainDetail( chainid ){


}

/**
 * 获取区块中的交易
 * @param chainid
 */
function getTans4Chain( channelName,blockHash ) {

}

/**
 *
 * 根据交易编号获取交易详情
 * @param txid
 *
 */
function  getTansDetail( channelName,txid ) {

}

/**
 * 获取账本中的chaincode
 */
function getChainCode4Channel(channelName) {


}