
var EventEmitter = require('events').EventEmitter;
var ledgerEvent = new EventEmitter();

var channels=['mychannel']

var currChannel=channels[0]

function changeChannel(channelName){
    currChannel=channelName
    ledgerMgr.emit('channgelLedger')
}

function getCurrChannel(){
    return currChannel
}

function getChannellist(){
    return channels
}
exports.getCurrChannel=getCurrChannel
exports.changeChannel=changeChannel
exports.ledgerEvent=ledgerEvent
exports.getChannellist=getChannellist