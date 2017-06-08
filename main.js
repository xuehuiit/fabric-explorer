/**
 * Created by shouhewu on 6/8/17.
 */
var express = require("express");
var app = express();

var query=require('./app/query.js')

//指定模板引擎
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/views');

//利用模板文件home.ejs渲染为html
app.get("/", function(req, res) {
    res.render('home.ejs', {
        name: 'tinyphp'
    });
});

var server = app.listen(8080, function() {
    console.log("请在浏览器访问：http://localhost:8080/");
});

//  Query Get Block by BlockNumber
app.get('/channels/:channelName/blocks/:blockId', function(req, res) {
    logger.debug('==================== GET BLOCK BY NUMBER ==================');
    let blockId = req.params.blockId;
    let peer = req.query.peer;
    logger.debug('channelName : ' + req.params.channelName);
    logger.debug('BlockID : ' + blockId);
    logger.debug('Peer : ' + peer);
    if (!blockId) {
        res.json(getErrorMessage('\'blockId\''));
        return;
    }

    query.getBlockByNumber(peer, blockId, req.username, req.orgname)
        .then(function(message) {
            res.send(message);
        });
});
// Query Get Transaction by Transaction ID
app.get('/channels/:channelName/transactions/:trxnId', function(req, res) {
    logger.debug(
        '================ GET TRANSACTION BY TRANSACTION_ID ======================'
    );
    logger.debug('channelName : ' + req.params.channelName);
    let trxnId = req.params.trxnId;
    let peer = req.query.peer;
    if (!trxnId) {
        res.json(getErrorMessage('\'trxnId\''));
        return;
    }

    query.getTransactionByID(peer, trxnId, req.username, req.orgname)
        .then(function(message) {
            res.send(message);
        });
});
// Query Get Block by Hash
app.get('/channels/:channelName/blocks', function(req, res) {
    logger.debug('================ GET BLOCK BY HASH ======================');
    logger.debug('channelName : ' + req.params.channelName);
    let hash = req.query.hash;
    let peer = req.query.peer;
    if (!hash) {
        res.json(getErrorMessage('\'hash\''));
        return;
    }

    query.getBlockByHash(peer, hash, req.username, req.orgname).then(
        function(message) {
            res.send(message);
        });
});
//Query for Channel Information
app.get('/channels/:channelName', function(req, res) {
    logger.debug(
        '================ GET CHANNEL INFORMATION ======================');
    logger.debug('channelName : ' + req.params.channelName);
    let peer = req.query.peer;

    query.getChainInfo(peer, req.username, req.orgname).then(
        function(message) {
            res.send(message);
        });
});
// Query to fetch all Installed/instantiated chaincodes
app.get('/chaincodes', function(req, res) {
    var peer = req.query.peer;
    var installType = req.query.type;
    //TODO: add Constnats
    if (installType === 'installed') {
        logger.debug(
            '================ GET INSTALLED CHAINCODES ======================');
    } else {
        logger.debug(
            '================ GET INSTANTIATED CHAINCODES ======================');
    }

    query.getInstalledChaincodes(peer, installType, req.username, req.orgname)
        .then(function(message) {
            res.send(message);
        });
});
// Query to fetch channels
app.get('/channels', function(req, res) {
    logger.debug('================ GET CHANNELS ======================');
    logger.debug('peer: ' + req.query.peer);
    var peer = req.query.peer;
    if (!peer) {
        res.json(getErrorMessage('\'peer\''));
        return;
    }

    query.getChannels(peer, req.username, req.orgname)
        .then(function(
            message) {
            res.send(message);
        });
});