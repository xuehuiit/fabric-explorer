var sql=require('../db/mysqlservice.js')
var query=require('../app/query.js')
var helper=require('../app/helper.js')
var co=require('co')
var blockListener=require('../listener/blocklistener.js')

function  syncBlock(channelName) {
    let maxBlockNum
    let curBlockNum
    Promise.all([
        getMaxBlockNum(channelName),
        getCurBlockNum(channelName)
    ]).then(datas=>{
        maxBlockNum=parseInt(datas[0])-1
        curBlockNum=parseInt(datas[1])
        co(saveBlockRange,channelName,curBlockNum,maxBlockNum).then(()=>{
            blockListener.emit('syncBlock', channelName)
        })
    }).catch(err=>{
        console.info(err)
    })


}

function* saveBlockRange(channelName,start,end){
    while(start<end){
        let block=yield query.getBlockByNumber('peer1',channelName,start,'admin','org1')
        blockListener.emit('createBlock',block)
        yield sql.saveRow('blocks',
            {
                'blocknum':start,
                'channelname':channelName,
                'prehash':block.header.previous_hash,
                'datahash':block.header.data_hash
            })

        start++
        console.info(block.header.number.toString())
        console.info(block.header.previous_hash)
        console.info(block.header.data_hash)

        //////////tx/////////////////////////
        let txLen=block.data.data.length
        for(let i=0;i<txLen;i++){
            let tx=block.data.data[i]
            yield sql.saveRow('transaction',
                {
                    'channelname':channelName,
                    'blockid':block.header.number.toString(),
                    'txhash':tx.payload.header.channel_header.tx_id,
                    'createdt':new Date(tx.payload.header.channel_header.timestamp)
                })
        }

    }
}


function getMaxBlockNum(channelName){
    return query.getChannelHeight('peer1',channelName,'admin','org1').then(data=>{
        return data
    }).catch(err=>{
        console.info(err)
    })
}

function getCurBlockNum(channelName){
    let curBlockNum
    return sql.getRowsBySQlCase(`select max(blocknum) as blocknum from blocks  where channelname='${channelName}'`).then(row=>{
        if(row.blocknum==null){
            curBlockNum=1
        }else{
            curBlockNum=parseInt(row.blocknum)
        }

    }).then(()=>{
        return curBlockNum
    }).catch(err=>{
        console.info(err)
    })
}

// syncBlock('mychannel')

// ====================chaincodes=====================================
function* saveChaincodes(channelName){
    let chaincodes=yield query.getInstalledChaincodes('peer1',channelName,'installed','admin','org1')
    let len=chaincodes.length
    for(let i=0;i<len;i++){
        let chaincode=chaincodes[i]
        let c= yield sql.getRowByPkOne(`select count(1) as c from chaincodes where name='${chaincode.name}' and version='${chaincode.version}' and path='${chaincode.path}' `)
        if(c.c==0){
            yield sql.saveRow('chaincodes',chaincode)
        }
    }

}

function syncChaincodes(channelName){
    co(saveChaincodes,channelName).then(()=>{
        blockListener.emit('syncChaincodes', channelName)
    })
}

// syncChaincodes('mychannel')

exports.syncBlock=syncBlock
exports.syncChaincodes=syncChaincodes