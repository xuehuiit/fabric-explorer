var EventEmitter = require('events').EventEmitter;
var blockListener = new EventEmitter();

var blockScanner=require('../service/blockscanner.js')

var blockMetrics=require('../metrics/metrics').blockMetrics
var txMetrics=require('../metrics/metrics').txMetrics

blockListener.on('createBlock',function (block) {
    blockMetrics.push(1)
    txMetrics.push(block.data.data.length)
})

blockListener.on('syncBlock',function (channelName) {
    blockScanner.syncBlock(channelName)
})

blockListener.on('syncChaincodes',function (channelName) {
    blockScanner.syncChaincodes(channelName)
})

exports.blockListener=blockListener