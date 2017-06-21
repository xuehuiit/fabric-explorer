/**
 * Created by fengxiang on 2017/6/21.
 */


var mysql = require('./mysqlservice')

mysql.openconnection()


//==========    saveRow() ===========

/*

var columnvalue = {

    'name':'tesgt121341234'

}

mysql.saveRow('bc_company',columnvalue).then( insertid=>{

    console.log( `the insert is ${insertid}  ` )

}).then(()=>{

    mysql.closeconnection()

}).catch( err=>{

    console.log(err)
    mysql.closeconnection()

} )

*/


// ===========   ======================

/*
var columnvalue = {

    'name':'tesgt121341234'

}


mysql.updateRowByPk('bc_company',columnvalue,'id',381).then( updaterows=>{

    console.log( `the updaterows is ${updaterows}  ` )

}).then(()=>{

    //mysql.closeconnection()

}).catch( err=>{

    console.log(err)
    mysql.closeconnection()

} )
*/


/*

var columnvalue = {

    'name':'tesgt121341234'

}

var searchparm = {

    'id':'123',
    'name':'3333'

}


mysql.updateRow('bc_company',columnvalue,searchparm).then( updaterows=>{

    console.log( `the updaterows is ${updaterows}  ` )

}).then(()=>{

    mysql.closeconnection()

}).catch( err=>{

    console.log(err)
    mysql.closeconnection()

} )
*/



//=======================  updateBySql  ======

/*
mysql.updateBySql(`update bc_company set name = 'ddddddd' where id = 380  `).then( updaterows=>{

    console.log( `the updaterows is ${updaterows}  ` )

}).then(()=>{

    mysql.closeconnection()

}).catch( err=>{

    console.log(err)
    mysql.closeconnection()

} )
*/


// =================== getRowByPk  ===============

mysql.getRowByPk('bc_company','','id',333).then( row=>{

    console.log( ` the updaterows is ${JSON.stringify(row)}  ` )

}).then(()=>{

    mysql.closeconnection()

}).catch( err=>{

    console.log(err)
    mysql.closeconnection()

} )

