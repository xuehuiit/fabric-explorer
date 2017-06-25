var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var openedSessions=0

io.on('connection', function(socket){
    openedSessions++
})