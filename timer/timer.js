var Metrics=require('../metrics/metrics.js').Metrics
var blockListener=require('../listener/blocklistener.js').blockListener

var blockPerMinMeter=new Metrics(12)
var txnPerSecMeter=new Metrics(12)
var txnPerMinMeter=new Metrics(12)


function start(io) {

    //每个1S 统计
    setInterval(function () {
        blockPerMinMeter.push(0)
        txnPerSecMeter.push(0)
        txnPerMinMeter.push(0)
    },1000)

    /*
    * /topic/metrics/txnPerSec
    * /topic/block/all
    * /topic/transaction/all
    */
    //每个1S 推送 pushTxnPerMin pushBlockPerMin /topic/metrics/
    setInterval(function () {
        io.emit('blockPerMinMeter',blockPerMinMeter.sum())
        io.emit('txnPerMinMeter',txnPerMinMeter.sum())
    },1000)

    //同步区块
    blockListener.emit('syncChaincodes', 'mychannel')
    blockListener.emit('syncChaincodes', 'mychannel')

}


exports.start=start

