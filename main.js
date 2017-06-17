/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */
var bcservice=require('./service/bcservice.js')

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


    // var orgs = orgconfig.getAllOrgs();
    //
    // test();
    // console.log(util.inspect(orgs));

    //console.log(util.inspect(bcserver.getAllPeerRequest()));

    var peers = bcservice.getAllPeerRequest();

    /*peers.forEach((item,index)=>{

        console.log(` ${index}  ==> ${item.name}  ==> ${item.org}`);

        query.getChannels(item.name,'admin',item.org).then(response=>{

            console.log(response)
            console.log("   =======  ")

        }).catch(err=>{
            console.log(err)
        })

    })*/

    var blocks;
    var txallums = 0;

    query.getChainInfo('peer1','mychannel','admin','org1').then(response_payloads=>{

            blocks = response_payloads.height.toString();
            return blocks

    }).then( res_blocks => {

        var blocknum = parseInt(res_blocks)

        //txallums = getTxCount(blocknum);

        return getTxCount(blocknum);



    } ).then( res_txs => {

        txallums = res_txs

        return query.getInstalledChaincodes('peer1','mychannel','installed','admin','org1')

    } ).then( res_chaincodes => {

        //var txs = res_blockinfo.data.data;

        //console.info( `**************** res_blockinfo is ${txs.length} =======  all trans is ${txallums}` )

        console.info( `**************** =======  all trans is ${txallums}` )

        console.info(` ################  ${res_chaincodes.length}  `)

        var chaincodenums = res_chaincodes.length

        res.render('index.ejs', {
            name: 'tinyphp',item_index_active:'1',blocks1:blocks,trans:txallums,chaincodenums:chaincodenums
        });


    } ).catch(err=>{
        console.info(err)
    })





});



//组织列表
app.get("/orgs", function(req, res) {
    var orgs=bcservice.getAllOrgs()
    //res.json(orgs)

    res.render('orgs.ejs', {
        name: 'tinyphp',item_index_orgs:'1'
    });
});

//组织列表
app.get("/peers", function(req, res) {
    var orgs=bcservice.getAllOrgs()
    //res.json(orgs)

    res.render('peers.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});

//节点详情
app.get("/peer_detail", function(req, res) {
    res.render('peer_detail.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});

//区块详情
app.get("/block_detail", function(req, res) {
    res.render('block_detail.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});


//交易详情
app.get("/trans_detail", function(req, res) {
    res.render('trans_detail.ejs', {
        name: 'tinyphp',item_index_peers:'1'
    });
});



//channel列表
app.get("/channels", function(req, res) {

    res.render('channels.ejs', {
        name: 'tinyphp',item_index_channels:'1'
    });

    /*bcservice.getAllChannels().then(channels=>{
        res.send(channels)
    }).catch(err=>{
        res.send(err)
    })*/
});


//账本详情
app.get("/channel_detail", function(req, res) {
    res.render('channel_detail.ejs', {
        name: 'tinyphp',item_index_channels:'1'
    });
});

app.get("/orgs/peers", function(req, res) {
    res.render('orgs.ejs', {
        name: 'tinyphp',item_index_orgs:'1'
    });
});





//channel详情
app.get("/channels/:channelName", function(req, res) {
    var channelName=req.params.channelName
    bcservice.getChainInfo(channelName).then(chainInfo=>{
        res.send(chaiinInfo)
    }).catch(err=>{
        res.send(err)
    })
});

//区块列表
app.get("/channels/:channelName/block/:blockNum", function(req, res) {
    var channelName=req.params.channelName
    var blockNum=req.params.blockNum
    bcservice.getBlock4Channel(channelName,blockNum).then(block=>{
        res.send(block)
    }).catch(err=>{
        res.send(err)
    })
});

//区块详情
/*app.get("/channels/:channelName/block/:blockHash", function(req, res) {
 res.render('peer_detail.ejs', {
 name: 'tinyphp',item_index_peers:'1'
 });
 });*/

//交易详情
app.get("/channels/:channelName/:txHash", function(req, res) {
    var channelName=req.params.channelName
    var txHash=req.params.txHash
    bcservice.getTans4Chain(channelName,txHash).then(tx=>{
        res.send(tx)
    }).catch(err=>{
        res.send(err)
    })
});


//
app.get("/channels/:channelName/chaincodes", function(req, res) {
    var channelName=req.params.channelName
    bcservice.getChainCode4Channel(channelName).then(chaincode=>{
        res.send(chaincode)
    }).catch(err=>{
        res.send(err)
    })
});







// ============= 启动服务器 =======================

var server = app.listen(8080, function() {
    console.log("请在浏览器访问：http://localhost:8080/");
    //console.log(path.join(__dirname, 'source'));
});



function getTxCount(blocknums){

    var parms = [];

    for(var ind = 0 ; ind < blocknums ; ind++){

        parms.push(query.getBlockByNumber('peer1','mychannel',ind,'admin','org1'));
    }



    return Promise.all(parms
    ).then(datas=>{
        let txcount=0
        datas.forEach((k,v) =>{
            txcount+=k.data.data.length
        })
        return Promise.resolve(txcount)
    }).catch(err=>{
        console.info(err)
    })
}



