/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */
var express = require("express");
var path = require('path');
var app = express();
var http= require('http').Server(app);
var bodyParser = require('body-parser');

require('./socket/websocketserver.js')(http)

var timer=require('./timer/timer.js')
timer.start()


var query=require('./app/query.js');
var ledgerMgr=require('./utils/ledgerMgr.js')

var statusMertics=require('./service/metricservice.js')

app.use(express.static(path.join(__dirname,'explorer_client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var query=require('./app/query.js')

// =======================   控制器绑定  ===================


app.post("/api/block/get", function(req, res) {
    let number=req.body.number
    query.getBlockByNumber('peer1',ledgerMgr.getCurrChannel(),parseInt(number),'admin','org1').then(block=>{
        res.json({
            'num':number,
            'txcount':block.data.data.length
        })
    })
});

//return latest status
app.post("/api/status/get", function(req, res) {
    statusMertics.getStatus(ledgerMgr.getCurrChannel(),function(status){
        res.json(status)
    })
});

app.post('/chaincodelist',function(req,res){
    statusMertics.getTxPerChaincode(ledgerMgr.getCurrChannel(),function (data) {
        res.json(data)
    })
})

app.post('/changeChannel',function(req,res){
    let channelName=req.body.channelName
    ledgerMgr.changeChannel(channelName)
})

app.post('/curChannel',function(req,res){
    res.send(ledgerMgr.getCurrChannel())
})

app.post('/channellist',function(req,res){
    res.send(ledgerMgr.getChannellist())
})

// ============= 启动服务器 =======================

var server = http.listen(8080, function() {
    console.log("请在浏览器访问：http://localhost:8080/");
});





