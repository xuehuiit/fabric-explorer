var Metrics=require('./metrics').Metrics
var blockListener=require('../listener/blocklistener.js')

var blockPerMinMeter=new Metrics(12)
var txnPerSecMeter=new Metrics(12)
var txnPerMinMeter=new Metrics(12)

//每个1S 统计
setInterval(function () {
    blockPerMinMeter.push(0)
    txnPerSecMeter.push(0)
    txnPerMinMeter.push(0)
},1000)

//每个1S 推送 pushTxnPerMin pushBlockPerMin /topic/metrics/

//同步区块
blockListener.emit('syncChaincodes', 'mychannel')
blockListener.emit('syncChaincodes', 'mychannel')

