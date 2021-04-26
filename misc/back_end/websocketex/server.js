var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);


io.on('connection',function(socket){
    console.log('connected!')
    socket.on('message',function(msg){

        console.log('message: ' + msg);

        //全員に配信する
        io.emit('message', msg);

        //特定のIDに配信（ここでは送ってきたIDに返信）
        io.to(socket.id).emit('personal', 'PERSONAL');
        console.log('id: ' + socket.id)
    });
});

http.listen(3000, function () {
    console.log('server start @3000 port');
});