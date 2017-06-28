var Metrics=require('../metrics/metrics.js').Metrics
var blockListener=require('../listener/blocklistener.js').blockListener()

var blockPerMinMeter=new Metrics(12)
var txnPerSecMeter=new Metrics(12)
var txnPerMinMeter=new Metrics(12)

var stomp=require('../socket/websocketserver.js').stomp()

var statusMertics=require('../service/metricservice.js')

var ledgerMgr=require('../utils/ledgerMgr.js')

var ledgerEvent=ledgerMgr.ledgerEvent
ledgerEvent.on('channgelLedger',function(){
    blockPerMinMeter.clean()
    txnPerSecMeter.clean()
    txnPerMinMeter.clean()
})

function start() {

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
        console.info('time topic .....................')
        stomp.send('/topic/metrics/blockPerMinMeter',{},JSON.stringify({timestamp:new Date().getTime()/1000,value:blockPerMinMeter.sum()}))
        stomp.send('/topic/metrics/txnPerMinMeter',{},JSON.stringify({timestamp:new Date().getTime()/1000,value:txnPerMinMeter.sum()}))
    },1000)

    //push status
    setInterval(function () {
        statusMertics.getStatus(ledgerMgr.getCurrChannel(),function (status) {
            stomp.send('/topic/metrics/status',{},JSON.stringify(status))
        })
    },1000)

    //push chaincode per tx
 /*   setInterval(function(){
        statusMertics.getTxPerChaincode(ledgerMgr.getCurrChannel(),function(txArray){
            stomp.send('/topic/metrics/txPerChaincode',{},JSON.stringify(txArray))
        })
    },1000)*/

    //同步区块
    blockListener.emit('syncChaincodes', ledgerMgr.getCurrChannel())
    blockListener.emit('syncBlock', ledgerMgr.getCurrChannel())

}


exports.start=start

