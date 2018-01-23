var bcconfig = require('./config.json');
var fabricservice = require('./fabricservice');
var sql=require('./db/mysqlservice.js')

var orgnamemap = initConfig(0);
var orgmspidmap = initConfig(1);


function initConfig (types) {

    let orgs = bcconfig['orgs'];
    var orgnamemap = {};
    var peers = {};
    var peermap = {};

    for ( let ind = 0 ; ind<orgs.length;ind++ ){

        let org = orgs[ind];
        let peers = org['peers'];

        for( let pind = 0 ; pind<peers.length; pind++ ){

            let peer = peers[pind];
            peermap[peer['name']] = peer;
        }


        org['peernamemap'] = peermap;


        if(  types == 0 ) {
            let orgname = org['name'];
            orgnamemap[orgname] = org;
        }else if( types == 1 ){

            let orgmspid = org['Org1MSP'];
            orgnamemap[orgmspid] = org;

        }

    }

    return orgnamemap;
}



function  getPeerRequest( peerrequest ) {

    if( bcconfig.enableTls  ){
        return "grpcs://"+peerrequest;
    }else{

        return "grpc://"+peerrequest;
    }

}


/**
 * 根据OrgMspId的值获取Org中包含的Peer节点
 * @param orgmspid
 */
var getPeers4OrgMspId = function (orgmspid) {

    return  orgmspidmap[orgmspid]['peers'];

}

/**
 * 根据OrgMspId的值获取Org中包含的Peer节点
 * @param orgmspid
 */
var getPeers4Org = function (orgname) {

    return  orgnamemap[orgname]['peers'];

}

/**
 *
 * @param orgname
 * @param peername
 *
 */
var getPeer = function( orgname , peername ){

    return orgnamemap[orgname][peername];

}



/** ================  fabric service   ================**/


var getkeyset4Transaction = ( transaction )=>{


    let actions = transaction['payload']['data']['actions'];

    if( actions != null && actions[0]['payload'] != null ){

    let ns_rwset = transaction['payload']['data']['actions'][0]['payload']['action']['proposal_response_payload']['extension']['results']['ns_rwset'];

    //console.info(JSON.stringify(blockinfo['data']['data'][0]['payload']['data']['actions'][0]['payload']['action']['proposal_response_payload']['extension']['results']['ns_rwset'][1]['rwset']['writes']));


    let keyset = {}

    for( let ind = 0 ; ind<ns_rwset.length ; ind++ ){

        let keysettemp = ns_rwset[ind];

        let namespace = keysettemp['namespace'];


        if( namespace != 'lscc' ){

            keyset = keysettemp;
            break;
        }

    }

    if( keyset != null && keyset['rwset']!=null )
        return { 'chaincode':keyset['namespace'],'writes':keyset['rwset']['writes'] }
    else
        return {};


    }else
        return {};

}


var testfunc = async (orgname)=> {

    let org = orgnamemap[orgname];
    let tempdir = bcconfig['keyValueStore'];
    let adminkey = org['admin']['key'];
    let admincert = org['admin']['cert'];

    fabricservice.inits(tempdir, adminkey, admincert);

    /*let blockchaininfo = await fabricservice.getBlockChainInfo('roberttestchannel', 'grpc://192.168.23.212:7051');
    console.info(JSON.stringify(blockchaininfo));
    */

    //for (let ind = 30; ind < 179; ind++) {


    let blockinfo = await fabricservice.getblockInfobyNum('roberttestchannel', 'grpc://192.168.23.212:7051', 94 );

    console.info(JSON.stringify(blockinfo['data']['data'][0]['payload']['header']['channel_header']['tx_id']));
    console.info(JSON.stringify(blockinfo['data']['data'][0]['payload']['header']['channel_header']['timestamp']));
    console.info(JSON.stringify(blockinfo['data']['data'][0]['payload']['data']['actions'][0]['payload']['action']['proposal_response_payload']['extension']));


    console.info((JSON.stringify(getkeyset4Transaction(blockinfo['data']['data'][0]))));



    //}
    //let peerchannels = await fabricservice.getPeerChannel('grpc://192.168.23.212:7051');
    //let peerchannels = await fabricservice.getPeerChannel('grpc://172.16.10.186:7051');
    /*let peerchannels = await fabricservice.getPeerChannel('grpc://172.16.10.187:7051');
    console.info(  JSON.stringify( peerchannels) );*/
    //{"channels":[{"channel_id":"roberttestchannel"},{"channel_id":"roberttestchannelnew"}]}




    //let installcc = await fabricservice.getPeerInstallCc('grpc://192.168.23.212:7051')
    //let instancecc = await fabricservice.getPeerInstantiatedCc('roberttestchannel12','grpc://192.168.23.212:7051');


    //let transinfo = await fabricservice.getTransaction('roberttestchannel','grpc://192.168.23.212:7051','56f51f9a54fb4755fd68c6c24931234a59340f7c98308374e9991d276d7d4a96')

    //获取被调用chaincode  和 keyset 的代码
    //console.info(  JSON.stringify( transinfo['transactionEnvelope']['payload']['data']['actions'][0]['payload']['action']['proposal_response_payload']['extension']['results']['ns_rwset']) );

    //获取被调用chaincode背书节点的信息
    //console.info(  JSON.stringify( transinfo['transactionEnvelope']['payload']['data']['actions'][0]['payload']['action']['endorsements']) );


    //测试数据库

    /*let testsqlresult = await sql.saveRow('block',{
        'channelid':'roberttestchannel',
        'blocknum':
        'datahash':'ddddddddddd',
        'perhash':'dddddddd',
        'txcount':13,
        'remark':'ddd',
    });


    console.info(  JSON.stringify( testsqlresult) );*/


    let channels = sql.getRowByPkOne( ` select id from channel where channelid = 'dddd' `)
    console.info(  JSON.stringify( channels) );

    sql.closeconnection();

}



var parserOrg = async ( orgname )=>{


        let org = orgnamemap[orgname];
        let peers = org['peers'];
        let channelpeermap = {};
        let peerjoinchannels = [];

        let tempdir = bcconfig['keyValueStore'];
        let adminkey = org['admin']['key'];
        let admincert = org['admin']['cert'];

        fabricservice.inits(tempdir,adminkey,admincert);


        for( let ind = 0 ; ind < peers.length ; ind++ ){

            let peer = peers[ind];
            let peerrequest = getPeerRequest(peer['requests']);
            let peerchannel = await fabricservice.getPeerChannel(peerrequest);

            //console.info(  JSON.stringify( peerchannels) );
            let peerchannels = peerchannel['channels'];

            peer['channels'] = peerchannels;


            peerjoinchannels.push(peer);


            for( let cind = 0 ; cind<peerchannels.length;cind++ ){

                let channel_id = peerchannels[cind]['channel_id'];

                if(  channelpeermap[channel_id] == null )
                    channelpeermap[channel_id] = peer;

            }


        }


        //更新channel 以及  channel和peer的关系
        //await modifypeers(peerjoinchannels);


        //更新channel上面的数据信息 区块链 交易 keyset
        await modify_channels( channelpeermap ,fabricservice);


        //更新peer上面的状态为 install的 chaincode信息
        await modify_peer_chaincode();

        //console.info(  JSON.stringify( peerjoinchannels) );

        //sql.closeconnection();


}



var modifypeers = async (peers)=>{


    for( let ind = 0 ; ind<peers.length ; ind++  ){

        let peer = peers[ind];
        let channels = peer['channels'];

        let peer_name = peer['name'];


        for( let cind = 0 ; cind < channels.length ; cind++ ){

            let channel = channels[cind];

            let channel_id = channel['channel_id'];

            await save_channel(channel_id);

            await save_peer_ref_channel(channel_id,peer_name);


        }


    }




}


var save_channel = async ( channel_id )=>{


    let channels = await sql.getRowByPkOne( ` select id from channel where channelid = '${channel_id}' `)

    if( channels == null  ){

        let channel = {
            'channelid':channel_id,
            'blocks':0,
            'trans':0,
            'remark':'',
        };

        await sql.saveRow('channel',channel);
    }


}


var save_peer_ref_channel = async ( channel_id , peer_name) =>{


    let peerrefchannels = await sql.getRowByPkOne( ` select id from peer_ref_channel where peer_name = '${peer_name}' and  channel_id = '${channel_id}'  `)

    if( peerrefchannels == null  ){

        let peer_ref_channel = {

            'peer_name':peer_name,
            'channel_id':channel_id,

        };


        await sql.saveRow( 'peer_ref_channel' , peer_ref_channel );

    }


}



var modify_channels = async ( channelpeermap,fabricservice )=>{



    for( let key in channelpeermap ){

        let channel_id = key ;
        let peer = channelpeermap[channel_id];

        await modify_channel_block( channel_id,peer,fabricservice);


    }




}



var modify_channel = async ( channels ) =>{



}



var modify_channel_block = async ( channel_id,peer,fabricservice )=>{


    let peer_request = getPeerRequest(peer['requests']);
    let blockchaininfo = await fabricservice.getBlockChainInfo(channel_id,peer_request);

    let channel = await  sql.getRowByPkOne(`  select * from channel where channelid = '${channel_id}'  `);
    //let channel = channels[0];

    let channelid = channel['id'];

    let blockheight = blockchaininfo['height']['low'];

    let updageresult = await sql.updateBySql(` update channel set blocks = ${blockheight} where id = ${channelid}  `);
    console.info(  JSON.stringify( blockchaininfo['height']['low']) );


    let countblocks = channel['countblocks'];


    while(  blockheight > countblocks  ){


        let blockinfo = await fabricservice.getblockInfobyNum( channel_id , peer_request , countblocks-1 );

        let blocknum = blockinfo['header']['number']['low'];
        let datahash = blockinfo['header']['data_hash'];
        let perhash =  blockinfo['header']['previous_hash'];

        let txcount = 0;

        let trans = blockinfo['data']['data'];

        if( trans != null ){
            txcount = trans.length;
        }


        let block = {
            'channelid':channel_id,
            'blocknum':blocknum,
            'datahash':datahash,
            'perhash':perhash,
            'txcount':txcount,
            'remark':'',
        };


        await sql.saveRow('block',block);

        await modify_channel_block_trans( channel_id , peer , blockinfo , fabricservice  )

        countblocks++;
        let updageresult = await sql.updateBySql(` update channel set countblocks = countblocks+1 where id = ${channelid}  `);






    }





}


var modify_channel_block_trans = async (channel_id,peer,blockinfo,fabricservice)=>{


    let trans = blockinfo['data']['data'];

    if( trans != null ){


        let blocknum = blockinfo['header']['number']['low'];
        let blockhash = blockinfo['header']['data_hash'];
        //let perhash =  blockinfo['header']['previous_hash'];



        for ( let ind = 0 ; ind<trans.length ; ind++ ){


            let transaction = trans[ ind ];

            let txhash = transaction['payload']['header']['channel_header']['tx_id'];
            let timestamp = transaction['payload']['header']['channel_header']['timestamp'];
            let keyset = getkeyset4Transaction(transaction);

            let chaincodename = '';

            if( keyset != null )
                chaincodename = keyset['chaincode'];


            let transactions = {

                'channelid':channel_id,
                'blocknum':blocknum,
                'blockhash':blockhash,
                'txhash':txhash,
                //'txcreatedt':timestamp,
                'chaincodename':chaincodename,
                'remark':''
            };

            let transcheck = await sql.getRowByPkOne( ` select id from transactions where txhash = '${txhash}' and  channelid = '${channel_id}'  `)
            if( transcheck == null )
                await sql.saveRow('transactions',transactions);

            let keyset_writer = keyset['writes'];

            if( keyset_writer != null ){

                for( let kind = 0 ; kind<keyset_writer.length;kind++ ){


                    let keysettemp = keyset_writer[kind];
                    let keyname = keysettemp['key'];
                    let is_delete = keysettemp['is_delete'];
                    //let keyname = keysettemp[''];

                    let is_delete_v = 0;

                    if( is_delete )
                            is_delete_v = 1;


                    let keyset = {

                        'channelid':channel_id,
                        'blocknum':blocknum,
                        'blockhash':blockhash,
                        'transactionhash':txhash,
                        'keyname':keyname,
                        'isdelete':is_delete_v,
                        'chaincode':chaincodename,
                        'remark':'',
                    };


                    let keysetcheck = await sql.getRowByPkOne( ` select id from keyset where keyname = '${keyname}' and  channelid = '${channel_id}'  `)
                    if(  keysetcheck == null  ){
                        let keysetresult = await sql.saveRow('keyset',keyset);
                    }



                }


            }






        }



    }

}


var modify_keyset = ()=>{



}




var modify_peer_chaincode = async ( peers  )=>{


}











exports.testfunc  = testfunc;
exports.getPeers4Org = getPeers4Org;
exports.getPeer=getPeer;
exports.ORGNAMEMAP = orgnamemap;
exports.parserOrg = parserOrg;