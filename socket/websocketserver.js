var app = require('express')();

var http
var io

function init(app){
    http= require('http').Server(app);
    io = require('socket.io')(http);

}
var openedSessions=0

io.on('connection', function(socket){
    openedSessions++
})

exports.init=init
exports.io=io