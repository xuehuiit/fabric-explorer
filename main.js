/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */
var bcservice=require('./service/bcservice.js')

var express = require("express");
var path = require('path');
var app = express();

require('./socket/websocketserver.js').init(app)

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
    res.redirect("/index")
});


//首页
app.get("/index", function(req, res) {


    // var orgs = orgconfig.getAllOrgs();
    //
    // test.js();
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

        res.render('peers.ejs', {
            name: 'tinyphp',item_index_peers:'1',blocks1:blocks,trans:txallums,chaincodenums:chaincodenums
        });


    } ).catch(err=>{
        console.info(err)
    })


});

//节点详情
app.get("/peer_detail", function(req, res) {
    var peers = bcservice.getAllPeerRequest();
    var blocks;
    var txallums = 0;
    var chaincodenums
    var block_array
    var tx_array=[]
    var chaincodes
    query.getChainInfo('peer1','mychannel','admin','org1').then(response_payloads=>{

        blocks = response_payloads.height.toString();
        return blocks

    }).then( res_blocks => {

        var blocknum = parseInt(res_blocks)
        return getTxCount(blocknum);

    } ).then( res_txs => {

        txallums = res_txs

        return query.getInstalledChaincodes('peer1','mychannel','installed','admin','org1')

    } ).then( res_chaincodes => {

        console.info( `**************** =======  all trans is ${txallums}` )

        console.info(` ################  ${res_chaincodes.length}  `)

        return chaincodenums = res_chaincodes.length
    } ).then(a=>{
        return bcservice.getBlockRange(parseInt(blocks)-5<=0?0:parseInt(blocks)-5,parseInt(blocks))
    }).then(b_array=>{
        block_array=b_array

        let tx_array=block_array[block_array.length-1].tx
        return bcservice.getTx('mychannel',tx_array)
    }).then(txs=>{

        txs.forEach(t=>{
            let tx={}
            tx.type=t.transactionEnvelope.payload.header.channel_header.type
            tx.timestamp=t.transactionEnvelope.payload.header.channel_header.timestamp
            tx.channel_id=t.transactionEnvelope.payload.header.channel_header.channel_id
            tx.id=t.transactionEnvelope.payload.header.channel_header.tx_id
            tx_array.push(tx)
        })
        return query.getInstalledChaincodes('peer1','mychannel','installed','admin','org1')
    }).then(cs=>{
        chaincodes=cs
        console.info(chaincodes)
        res.render('peer_detail.ejs', {
            name: 'tinyphp',
            item_index_peers:'1',
            peers:peers.length,blocks1:blocks,
            trans:txallums,
            chaincodenums:chaincodenums,
            block_array:block_array,
            tx_array:tx_array,
            chaincodes:chaincodes
        });
    }).catch(err=>{

        console.info(err)
    })


});

//区块详情
app.get("/block_detail", function(req, res) {

    var blocknums = req.query.blocknums

    console.log(` ===========   ${ JSON.stringify(req.query) } `)

    query.getBlockByNumber('peer1','mychannel',blocknums,'admin','org1').then(response_payloads=>{

        console.info("==========================================")
        // console.info(JSON.stringify(response_payloads.data.data[0]))

        /* var head = response_payloads.header;
         for( key in head){
         console.log(` <div class="form-group"><label class="col-sm-2 control-label">${key}:</label>
         <div class="col-sm-10"><input type="text" class="form-control" value="${head[key]}"></div>
         </div> `)
         }*/

        var txs = response_payloads.data.data;
        //console.info(JSON.stringify(txs))

        var txs = response_payloads.metadata.metadata;

        var data1 = txs[0];

        var signatures = data1['signatures'][0]['signature_header']['creator']

        //console.info(JSON.stringify(signatures))



        return response_payloads;


    }).then( response_payloads =>{


        var head = response_payloads.header
        var metadata = response_payloads.metadata.metadata;
        var data = response_payloads.data.data;
        var str = JSON.stringify(response_payloads)
        console.log( JSON.stringify(metadata[0]['signatures'][0]['signature_header']['creator']['Mspid']) )


        res.render('block_detail.ejs', {
            name: 'tinyphp',item_index_peers:'1',head:head,data:data,metadata:metadata,jsonstr:str
        });

    }).catch(err =>{

        console.info(err)

    })
});


//交易详情
app.get("/trans_detail", function(req, res) {

    var txid = req.query.txid


    query.getTransactionByID('peer1','mychannel',txid,'admin','org1').then(response_payloads=>{


        return response_payloads

    }).then( response_payloads =>{


        var header = response_payloads['transactionEnvelope']['payload']['header']
        var data = response_payloads['transactionEnvelope']['payload']['data']
        var signature = response_payloads['transactionEnvelope']['signature'].toString("hex")
        var str = JSON.stringify(response_payloads)
            console.log( JSON.stringify( data['actions'][0]['payload'] ) )

        var channel_header = header['channel_header']

        for( key in channel_header){

            console.log(` <div class="form-group">
                           <label class="col-sm-2 control-label">${key}:</label>
                            <div class="col-sm-10"><input type="text" class="form-control" value="<%=header.channel_header.${key}%>"></div>
                      </div> `)

        }



        res.render('trans_detail.ejs', {
            name: 'tinyphp',item_index_peers:'1',header:header,data:data,signature:signature,jsonstr:str
        });



    }).catch(err=>{
        console.info(err)
    })



});



//channel列表
app.get("/channels", function(req, res) {

    var peers = bcservice.getAllPeerRequest();


    var blocks;
    var txallums = 0;

    query.getChainInfo('peer1','mychannel','admin','org1').then(response_payloads=>{

        blocks = response_payloads.height.toString();
        return blocks

    }).then( res_blocks => {

        var blocknum = parseInt(res_blocks)
        return getTxCount(blocknum);

    } ).then( res_txs => {

        txallums = res_txs

        return query.getInstalledChaincodes('peer1','mychannel','installed','admin','org1')

    } ).then( res_chaincodes => {

        console.info( `**************** =======  all trans is ${txallums}` )

        console.info(` ################  ${res_chaincodes.length}  `)

        var chaincodenums = res_chaincodes.length

        res.render('channels.ejs', {
            name: 'tinyphp',item_index_channels:'1',peers:peers.length,blocks1:blocks,trans:txallums,chaincodenums:chaincodenums
        });


    } ).catch(err=>{
        console.info(err)
    })
});


//账本详情
app.get("/channel_detail", function(req, res) {

    var peers = bcservice.getAllPeerRequest();
    var blocks;
    var txallums = 0;
    var chaincodenums
    var block_array
    var tx_array=[]
    var chaincodes

    query.getChainInfo('peer1','mychannel','admin','org1').then(response_payloads=>{

        blocks = response_payloads.height.toString();
        return blocks

    }).then( res_blocks => {

        var blocknum = parseInt(res_blocks)
        return getTxCount(blocknum);

    } ).then( res_txs => {

        txallums = res_txs

        return query.getInstalledChaincodes('peer1','mychannel','installed','admin','org1')

    } ).then( res_chaincodes => {

        console.info( `**************** =======  all trans is ${txallums}` )

        console.info(` ################  ${res_chaincodes.length}  `)

        return chaincodenums = res_chaincodes.length
    } ).then(a=>{
        return bcservice.getBlockRange(parseInt(blocks)-5<=0?0:parseInt(blocks)-5,parseInt(blocks))
    }).then(b_array=>{
        block_array=b_array

        let tx_array=block_array[block_array.length-1].tx
        return bcservice.getTx('mychannel',tx_array)
    }).then(txs=>{

        txs.forEach(t=>{
            let tx={}
            tx.type=t.transactionEnvelope.payload.header.channel_header.type
            tx.timestamp=t.transactionEnvelope.payload.header.channel_header.timestamp
            tx.channel_id=t.transactionEnvelope.payload.header.channel_header.channel_id
            tx.id=t.transactionEnvelope.payload.header.channel_header.tx_id
            tx_array.push(tx)
        })
        return query.getInstalledChaincodes('peer1','mychannel','installed','admin','org1')
    }).then(cs=>{
        chaincodes=cs
        console.info(chaincodes)
        res.render('channel_detail.ejs', {
            name: 'tinyphp',
            item_index_channels:'1',
            peers:peers.length,blocks1:blocks,
            trans:txallums,
            chaincodenums:chaincodenums,
            block_array:block_array,
            tx_array:tx_array,
            chaincodes:chaincodes
        });
    }).catch(err=>{

        console.info(err)
    })

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




app.get("/testmysql", function(req, res) {

    var parm = res.query.cheenid;


    connection.query(' select * from bc_company ', function(err, rows, fields  ) {

        if (err) throw err;
        // console.log(  `The solution is: ${rows.length }  `  );
        setfunc( rows.length )

        res.render('orgs.ejs', {
            name: 'tinyphp',item_index_orgs:'1'
        });

    });



});

app.get("/testmysql1", function(req, res) {

    connection.query(' select * from bc_company ', function(err, rows, fields  ) {

        if (err) throw err;

        connection.query(' select * from bc_compan1 ', function(err, rows, fields  ) {

            if (err) throw err;


            return rows

        },function (result) {



        });




    });


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




