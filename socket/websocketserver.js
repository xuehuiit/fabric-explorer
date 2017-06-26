var app = require('express')();

var io

var openedSessions=0

function init(io){
    io.on('connection', function(socket){
        openedSessions++
    })

}


exports.init=init
exports.io=io