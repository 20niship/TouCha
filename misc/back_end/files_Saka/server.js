var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require("mongodb").MongoClient;
const _url = 'mongodb://localhost:27017/TC';
/* var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/TC');
var mesSchema = mongoose.Schema({
    id: String,
    message: String
});
return mongoose.model('meslogs', mesSchema); */

/* app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
}); */

io.on('connection',function(socket){
    socket.on('message',function(msg){

        MongoClient.connect(_url, (err, client) => {
            // callbackに渡されるオブジェクトが変わった
            // db名を明示的に指定してdbオブジェクトを取得する必要がある
            const db = client.db('TC');
          
            db.collection('content', (err, collection) => {
                collection.insertOne({
                    "userid": socket.id,
                    "message": msg
                }, (error, result) => {
                    client.close();
                });
            });
          });           

        //全員に配信
        io.emit('message', msg);
        console.log(msg);

        //特定のIDに配信（ここでは送ってきたIDに返信）
      /* io.to(socket.id).emit('personal', 'PERSONAL');
        console.log('id: ' + socket.id + msg); */
    }); 
});

http.listen(3000, function () {
    console.log('server start @3000 port');
});