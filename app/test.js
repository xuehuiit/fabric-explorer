var helper=require('./helper.js')
var query=require('./query.js')

/*
helper.getOrgAdmin('org1').then(user =>{
    console.info(user)
}).catch(err =>{
    console.info(err)
})

helper.getAdminUser('org1').then(user =>{
    console.info(user)
}).catch(err =>{
    console.info(err)
})
*/


/*query.getBlockByNumber('peer1',4,'admin','org1').then(response_payloads=>{
    console.info(JSON.stringify(response_payloads))
}).catch(err =>{
    console.info(err)
})*/

/*
query.getTransactionByID('peer1','63843009a8114e3a6fb68f510f638b5f6a7e1448759c036710ebd9affa371db2','admin','org1').then(response_payloads=>{
    console.info(response_payloads)
}).catch(err=>{
    console.info(err)
})
*/

/*query.getBlockByHash('peer1','6f0ebf8c878a90072602c0f9c5de7f14081753caa81b0a5a314b166fdb73ee44','admin','org1').then(response_payloads=>{
    console.info(response_payloads)
}).catch(err=>{
    console.info(err)
})*/

/*query.getChainInfo('peer1','admin','org1').then(response_payloads=>{
    console.info(response_payloads)
}).catch(err=>{
    console.info(err)
})*/

/*
query.getInstalledChaincodes('peer1','installed','admin','org1').then(response=>{
    console.info(response)
}).catch(err=>{
    console.info(err)
})*/

query.getChannels('peer1','admin','org1').then(response=>{
    console.info(response)
}).catch(err=>{
    console.info(err)
})
