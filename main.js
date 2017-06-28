/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */
var bcservice=require('./service/bcservice.js')

var express = require("express");
var path = require('path');
var app = express();
var http= require('http').Server(app);

require('./socket/websocketserver.js')(http)

var timer=require('./timer/timer.js')
timer.start()

//app.use(express.static('source'));
//app.use('/source', express.static('source'));
app.use('/source', express.static('public'));
//app.use(express.static(path.join(__dirname, '/source')))

var query=require('./app/query.js');

//指定模板引擎
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/views');

var ledgerMgr=require('./utils/ledgerMgr.js')


// =======================   控制器绑定  ===================

//首页
app.get('/',function(req,res){

})

app.post("/api/block/get", function(req, res) {
    console.info(req.body)
});

app.post('/chaincodelist',function(req,res){

})

app.post('/changeLedger',function(req,res){
    let channelName
    ledgerMgr.changeChannel(channelName)
})

// ============= 启动服务器 =======================

var server = http.listen(8080, function() {
    console.log("请在浏览器访问：http://localhost:8080/");
    //console.log(path.join(__dirname, 'source'));
});





