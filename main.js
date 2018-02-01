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

require('./socket/websocketserver.js').init(http)

var timer=require('./timer/timer.js')
timer.start()


var query=require('./app/query.js');
var ledgerMgr=require('./utils/ledgerMgr.js')

var statusMertics=require('./service/metricservice.js')

var channelsRouter=require('./router/channels.js');

var keyset=require('./service/keysetService.js');

var bcexplorerservice = require('./service/bcexplorerservice');


app.use(express.static(path.join(__dirname,'explorer_client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/apis',channelsRouter)


var sql=require('./db/mysqlservice.js')

var config = require('./config.json');
var host = process.env.HOST || config.host;
var port = process.env.PORT || config.port;


// =======================   controller  ===================

app.post("/api/tx/getinfo", async function(req, res) {

    let  txid = req.body.txid
    if( txid != '0' ){

    let fabricservice = bcexplorerservice.getCurrOrgFabricservice();
    let curr_channel = ledgerMgr.getCurrChannel();
    let channelpeermap = ledgerMgr.getcurrchannelpeerma();
    let peer = channelpeermap[curr_channel];

    //let peerRequest = bcexplorerservice.getPeerRequest(peer['requests']);

    //peer['requests'] = bcexplorerservice.getPeerRequest(peer['requests']);

    let response_payloads = await fabricservice.getTransaction(curr_channel , bcexplorerservice.getPeerRequestInfo(peer) ,txid);

    var header = response_payloads['transactionEnvelope']['payload']['header']
    var data = response_payloads['transactionEnvelope']['payload']['data']
    var signature = response_payloads['transactionEnvelope']['signature'].toString("hex")


    let otherorgs = bcexplorerservice.getOtherOrg();


    res.send({
        'tx_id':header.channel_header.tx_id,
        'timestamp':header.channel_header.timestamp,
        'channel_id':header.channel_header.channel_id,
        'type':header.channel_header.type,
    })


    /*query.getTransactionByID('peer1',ledgerMgr.getCurrChannel(),txid,'admin','org1').then(response_payloads=>{

        var header = response_payloads['transactionEnvelope']['payload']['header']
        var data = response_payloads['transactionEnvelope']['payload']['data']
        var signature = response_payloads['transactionEnvelope']['signature'].toString("hex")

        res.send({
            'tx_id':header.channel_header.tx_id,
            'timestamp':header.channel_header.timestamp,
            'channel_id':header.channel_header.channel_id,
            'type':header.channel_header.type,
        })
    })*/

    }else{
        res.send({ })
    }


});

app.post("/api/tx/json", async function(req, res) {

    let  txid = req.body.number



    if( txid != '0' ){



        let fabricservice = bcexplorerservice.getCurrOrgFabricservice();
        let curr_channel = ledgerMgr.getCurrChannel();
        let channelpeermap = ledgerMgr.getcurrchannelpeerma();
        let peer = channelpeermap[curr_channel];

        let peerRequest = bcexplorerservice.getPeerRequest(peer['requests']);

        //peer['requests'] = bcexplorerservice.getPeerRequest(peer['requests']);

        let response_payloads = await fabricservice.getTransaction( curr_channel , bcexplorerservice.getPeerRequestInfo(peer)  , txid );


        var header = response_payloads['transactionEnvelope']['payload']['header'];
        var data = response_payloads['transactionEnvelope']['payload']['data'];
        var signature = response_payloads['transactionEnvelope']['signature'].toString("hex");

        var blockjsonstr = JSON.stringify(response_payloads['transactionEnvelope']);

        res.send(blockjsonstr);

        /*query.getTransactionByID('peer1',ledgerMgr.getCurrChannel(),txid,'admin','org1').then(response_payloads=>{

            var header = response_payloads['transactionEnvelope']['payload']['header']
            var data = response_payloads['transactionEnvelope']['payload']['data']
            var signature = response_payloads['transactionEnvelope']['signature'].toString("hex")

            var blockjsonstr = JSON.stringify(response_payloads['transactionEnvelope'])

            res.send(blockjsonstr)

        })
        */
    }else{

        res.send({ })

    }

});

app.post("/api/block/json", async function(req, res) {

    let number=req.body.number

    let fabricservice = bcexplorerservice.getCurrOrgFabricservice();
    let curr_channel = ledgerMgr.getCurrChannel();
    let channelpeermap = ledgerMgr.getcurrchannelpeerma();
    let peer = channelpeermap[curr_channel];

    let peerRequest = bcexplorerservice.getPeerRequest(peer['requests']);

    //peer['requests'] = bcexplorerservice.getPeerRequest(peer['requests']);

    //let response_payloads = await fabricservice.getTransaction(curr_channel , peerRequest ,txid);
    let blockinfo = await fabricservice.getblockInfobyNum( curr_channel , bcexplorerservice.getPeerRequestInfo(peer)  , parseInt(number) );

    var blockjsonstr = JSON.stringify(blockinfo);

    res.send(blockjsonstr);

    /*query.getBlockByNumber('peer1',ledgerMgr.getCurrChannel(),parseInt(number),'admin','org1').then(block=>{

        var blockjsonstr = JSON.stringify(block)

        res.send(blockjsonstr)
    })*/

});


app.post("/api/block/getinfo", async function(req, res) {



    let number=req.body.number

    let fabricservice = bcexplorerservice.getCurrOrgFabricservice();
    let curr_channel = ledgerMgr.getCurrChannel();
    let channelpeermap = ledgerMgr.getcurrchannelpeerma();
    let peer = channelpeermap[curr_channel];

    let peerRequest = bcexplorerservice.getPeerRequest(peer['requests']);

    //let response_payloads = await fabricservice.getTransaction(curr_channel , peerRequest ,txid);

    //peer['requests'] = bcexplorerservice.getPeerRequest(peer['requests']);


    let blockinfo = await fabricservice.getblockInfobyNum( curr_channel , bcexplorerservice.getPeerRequestInfo(peer)  , parseInt(number) );
    let blockjsonstr = JSON.stringify(blockinfo);

    let low = blockinfo['header']['number']['low'];
    /*let previous_hash = blockinfo['header']['previous_hash'];
    let data_hash = blockinfo['header']['data_hash'];
    let transactions = blockinfo['header']['number']['low'];
    */

    res.send({
        'number':low,
        'previous_hash':blockinfo['header']['previous_hash'],
        'data_hash':blockinfo['header']['data_hash'],
        'transactions':blockinfo['data']['data']
    })



    /*let number=req.body.number
    query.getBlockByNumber('peer1'']',ledgerMgr.getCurrChannel(),parseInt(number),'admin','org1').then(block=>{
        res.send({
            'number':block.header.number.toString(),
            'previous_hash':block.header.previous_hash,
            'data_hash':block.header.data_hash,
            'transactions':block.data.data
        })
    })*/


});

/*app.post("/api/block/get", function(req, res) {
    let number=req.body.number
    query.getBlockByNumber('peer1',ledgerMgr.getCurrChannel(),parseInt(number),'admin','org1').then(block=>{
        res.send({
            'number':number,
            'txCount':block.data.data.length
        })
    })
});*/
app.post("/api/block/get", function(req, res) {
    let number=req.body.number
    sql.getRowByPkOne(`select blocknum ,txcount from blocks where channelname='${ledgerMgr.getCurrChannel()}' and blocknum='${number}'`).then(row=>{
        if(row){
            res.send({
                'number':row.blocknum,
                'txCount':row.txcount
            })
        }
    })

});

//return latest status
app.post("/api/status/get", function(req, res) {
    let sectionName=ledgerMgr.currSection();
    if (sectionName=='channel'){
        statusMertics.getStatus(ledgerMgr.getCurrChannel(),function(status){
            res.send(status)
        })
    } else if(sectionName=='org'){
        bcexplorerservice.getOrgStatus().then(status=>{
            res.send(status)
        });

    } else if(sectionName=='peer'){
        bcexplorerservice.getPeerStatus().then(status=>{
            res.send(status)
        });
    }

});

app.post('/chaincodelist',function(req,res){
    statusMertics.getTxPerChaincode(ledgerMgr.getCurrChannel(),function (data) {
        res.send(data)
    })
})

app.post('/changeChannel',function(req,res){
    let channelName=req.body.channelName
    ledgerMgr.changeChannel(channelName)
    res.send({'a':ledgerMgr.getCurrChannel()})
})

app.post('/curChannel',function(req,res){
    res.send({'currentChannel':ledgerMgr.getCurrChannel()})
})

app.post('/channellist',function(req,res){
    ledgerMgr.getChannellist().then(channelList=>{
        res.send({'channelList':channelList});
    }).catch(err=>{
        res.send({'channelList':[ledgerMgr.getCurrChannel()]});
    })
})

app.post('/curPeer',function(req,res){
    res.send({'currentPeer':ledgerMgr.getCurrpeer()['name']})
})

app.post('/peerselectlist',function(req,res){
    let peerlist=bcexplorerservice.getCurrOrgPeers();
    res.send({'peerlist':peerlist});
})

app.post('/changePeer',function(req,res){
    let peerName=req.body.peerName
    let currorg = ledgerMgr.getCurrOrg();
    let peer = bcexplorerservice.getPeer(ledgerMgr.getCurrOrg(),peerName);
    ledgerMgr.changeCurrPeer(peer)
    res.send({'a':ledgerMgr.getCurrpeer()})
})

app.post('/showSection',function(req,res){
    let sectionName=req.body.sectionName;
    ledgerMgr.changeSection(sectionName);
    res.send({'a':ledgerMgr.currSection()});
})


app.post('/getKeyset',function(req,res){
    keyset.getKeyset().then(rows=>{
        res.send(rows);
    })
})




app.post('/channellist4peer', async function(req,res){


    let currp = ledgerMgr.getCurrpeer();
    let peername = currp['name'];

    let searchSql = `select * from channel where channelname in ( select channelname from peer_ref_channel where peer_name = '${peername}' ) `;


    let chaincodesmap = await sql.getSQL2Map( ` select channelname , count(distinct(name)) as nums from chaincodes  where peer_name = '${peername}'  group by  channelname  `,'channelname');
    let channeltransmap  = await sql.getSQL2Map( ` select channelname , count(*) as nums from transaction group by  channelname `,'channelname');


    let keysetmap  = await sql.getSQL2Map( ` select channelname , count(*) as nums from keyset group by  channelname `,'channelname');



    let rows = await sql.getRowsBySQlNoCondtion(searchSql);

    for( let ind = 0 ; ind < rows.length ; ind++ ){

        let cc = rows[ind];
        let channelname = cc['channelname'];

        cc['ccnums'] = chaincodesmap.get(channelname)['nums']
        cc['tranmums'] = channeltransmap.get(channelname)['nums']
        cc['keynums'] = keysetmap.get(channelname)['nums']


    }




    res.send(rows);


})

app.post('/chaincodelist4peer',async function(req,res){


    let currp = ledgerMgr.getCurrpeer();
    let peername = currp['name'];

    let searchsql = ` select * from chaincodes where peer_name in ( select peer_name from peer_ref_channel where peer_name = '${peername}' )  order by  ccstatus desc `;
    let chaincodelist  = await sql.getRowsBySQlNoCondtion( searchsql );



    for( let ind = 0 ; ind < chaincodelist.length ; ind++ ){

        let cc = chaincodelist[ind];

        if( cc['ccstatus'] == 0  )
                cc['ccstatus_commit'] = 'Install';
        else
                cc['ccstatus_commit'] = 'Instantiated';

    }

    res.send(chaincodelist);

})




app.post('/peerlist', async function(req,res){


    let curr_channel = ledgerMgr.getCurrChannel();
    let curr_channel_peermap = ledgerMgr.getCurrchannelpeersmap()[curr_channel];
    let curr_channel_peers = [];

    for (let key in curr_channel_peermap) {
        let peer = curr_channel_peermap[key];
        curr_channel_peers.push(peer);

    }


    /* let orgs = await bcexplorerservice.getOrgStatus();
    let peerstatus = await bcexplorerservice.getPeerStatus();
    */

    //let currp = ledgerMgr.getCurrpeer();
    let currpeerjoinchannel = await bcexplorerservice.getCurrPeerJoinChannels();
    let currpeerconCc = await  bcexplorerservice.getCurrPeerContaitCc();

    res.send(curr_channel_peers);

    /*keyset.getKeyset().then(rows=>{
        console.info(JSON.stringify(rows))
        res.send(rows);
    })*/
})


app.post('/network',function(req,res){


    let curr_channel = ledgerMgr.getCurrChannel();
    let curr_org = ledgerMgr.getCurrOrg();
    let curr_peers = bcexplorerservice.getPeers4Org(curr_org);
    let curr_orderer = bcexplorerservice.orderers[0];
    let other_org = bcexplorerservice.getOtherOrg();

    let currorgobj = bcexplorerservice.ORGNAMEMAP[curr_org];
    let currmspid = currorgobj['mspid'];

    /*{id: 1, label: 'CA', font:{size:30}, shape: 'circle'},
    {id: 2, label: 'Orderer' , font:{size:30}, shape: 'ellipse' },
    {id: 3, label: 'Org1Msp' ,font:{size:30}, shape: 'ellipse' },*/

    let nodearr = [];
    let ledag = [];

    let ordererdata = {id: 1, label: 'Orderer', font:{size:30}, shape: 'ellipse'};
    let currmsp = {id: 2, label: `${currmspid}`, font:{size:30}, shape: 'box'};

    nodearr.push(ordererdata);
    nodearr.push(currmsp);


    let ind = 3;

    let peerind = 3;

    for( let key in other_org   ){

        if(  key == currmspid )
            continue;
        let orgmsp = other_org[key];
        let temp =  {id: peerind , label:  `${key}`  , font:{size:30}, shape: 'box'};
        nodearr.push(temp);

        peerind ++;
    }

    for(  let index2 = peerind ;  index2< curr_peers.length+peerind ; index2++   ){

        let peertemp = curr_peers[index2-peerind];
        let temp1 =  {id: index2 , label:  `${peertemp['name']}`  , font:{size:30,color:'white'}, shape: 'database',color:'DarkViolet'};
        nodearr.push(temp1);

    }


    ledag.push({from: 2, to: 1, arrows:'to'});

    for ( let index5 = ind-1 ; index5<peerind-1;index5++ ){

        let nodetemp = nodearr[index5];
        let nodeid = nodetemp['id'];
        ledag.push({from: nodeid , to: 1, arrows:'to'});

    }



    for( let index6 = peerind-1 ; index6<nodearr.length ; index6++){


        let nodetemp = nodearr[index6];
        let nodeid = nodetemp['id'];
        ledag.push({from: nodeid , to: 2 , arrows:'to'});

    }


    let result = {
        "nodearr":nodearr, "edgesarr":ledag


    }


    //{from: 3, to: 2, arrows:'to'},


    res.send(result);




    /*keyset.getKeyset().then(rows=>{
        console.info(JSON.stringify(rows))
        res.send(rows);
    })*/



})

// ============= start server =======================

var server = http.listen(port, function() {
    console.log(`Please open Internet explorer to access ：http://${host}:${port}/`);
});





//注册异常处理器
process.on('unhandledRejection', function (err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);

