var sql = require('../db/mysqlservice.js');
var ledgerMgr = require('../utils/ledgerMgr');

async function getKeyset() {
    let rows = await sql.getRowsBySQlNoCondtion(`select channelname,blocknum,blockhash,transactionhash,keyname,isdelete,chaincode from keyset where channelname='${ledgerMgr.getCurrChannel()}'`)
    return rows;
}

module.exports.getKeyset=getKeyset;