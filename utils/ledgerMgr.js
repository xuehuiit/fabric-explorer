
var EventEmitter = require('events').EventEmitter;
var ledgerEvent = new EventEmitter();

var channels=['mychannel']

var currChannel='mychannel'

function changeChannel(channelName){
    currChannel=channelName
    ledgerMgr.emit('channgelLedger')
}

function getCurrChannel(){
    return currChannel
}

exports.getCurrChannel=getCurrChannel
exports.changeChannel=changeChannel
exports.ledgerEvent=ledgerEvent