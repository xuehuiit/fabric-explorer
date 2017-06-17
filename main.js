/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */
var express = require("express");
var path = require('path');
var app = express();

//app.use(express.static('source'));
//app.use('/source', express.static('source'));
app.use('/source', express.static('public'));

//app.use(express.static(path.join(__dirname, '/source')))

var query=require('./app/query.js');

//指定模板引擎
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/views');


// =======================   控制器绑定  ===================

/**
 *  /channels
 *  /channels/:channelName
 *  /channels/:channelName/block/:blockNum
 *  /channels/:channelName/block/:blockHash
 *  /channels/:channelName/block/:blockNum/:txHash
 *  /channels/:channelName/chaincodes
 *
 *  /orgs
 *  /orgs/peers
 *
 *
 */

//首页
app.get("/", function(req, res) {
    res.render('index.ejs', {
        name: 'tinyphp',item_index_active:'1'
    });
});


//首页
app.get("/index", function(req, res) {
    res.render('index.ejs', {
        name: 'tinyphp',item_index_active:'1'
    });
});



//组织列表
app.get("/orgs", function(req, res) {
    res.render('orgs.ejs', {
        name: 'tinyphp',item_index_orgs:'1'
    });
});

app.get("/orgs/peers", function(req, res) {
    res.render('orgs.ejs', {
        name: 'tinyphp',item_index_orgs:'1'
    });
});

//channel列表
app.get("/channels", function(req, res) {
    res.render('channels.ejs', {
        name: 'tinyphp',item_index_channels:'1'
    });
});

//channel详情
app.get("/channels/:channelName", function(req, res) {
    res.render('channel_detail.ejs', {
        name: 'tinyphp',item_index_channels:'1'
    });
});

//区块列表
app.get("/channels/:channelName/block/:blockNum", function(req, res) {
    res.render('peers.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});

//区块详情
app.get("/channels/:channelName/block/:blockHash", function(req, res) {
    res.render('peer_detail.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});

//交易详情
app.get("/channels/:channelName/block/:blockNum/:txHash", function(req, res) {
    res.render('block_detail.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});


//
app.get("/channels/:channelName/chaincodes", function(req, res) {
    res.render('trans_detail.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});







// ============= 启动服务器 =======================

var server = app.listen(8080, function() {
    console.log("请在浏览器访问：http://localhost:8080/");
    //console.log(path.join(__dirname, 'source'));
});






