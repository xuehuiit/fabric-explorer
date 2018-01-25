var bcexplorerservice = require('./bcexplorerservice');


/*
var orgnamemap = bcexplorerservice.ORGNAMEMAP;

console.info(  JSON.stringify( orgnamemap ) );*/


//bcexplorerservice.testfunc('org1');

bcexplorerservice.parserOrg('org1');



//注册异常处理器
process.on('unhandledRejection', function (err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);