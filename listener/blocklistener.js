var EventEmitter = require('events').EventEmitter;
var blockListener = new EventEmitter();

var blockScanner=require('../service/blockscanner.js')
blockScanner.setBlockListener(blockListener)

var blockMetrics=require('../metrics/metrics').blockMetrics
var txMetrics=require('../metrics/metrics').txMetrics

blockListener.on('createBlock',function (block) {
    blockMetrics.push(1)
    txMetrics.push(block.data.data.length)
})

blockListener.on('syncBlock',function (channelName) {
    setTimeout(function () {
        blockScanner.syncBlock(channelName)
    },1000)
})

blockListener.on('syncChaincodes',function (channelName) {
    setTimeout(function () {
        blockScanner.syncChaincodes(channelName)
    },1000)
})

exports.blockListener=function () {
    return blockListener
}