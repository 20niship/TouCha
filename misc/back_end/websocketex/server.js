var express = require('express');
const { appendFileSync } = require('fs');
const { userInfo } = require('os');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
var sockets = {}

io.on('connection',function(socket){
    console.log('connected!')
    socketId = socket.id
    //socketsにIDをKeyにして情報を入れる
    sockets.socketId = {
        socket : socket,
        logined : false
    }
    socket.on('message',function(msg){
        //送られたJsonを変数(連想配列)にする
        message = JSON.parse(msg);
        //msg.protocolの内容で処理を分岐
        switch (message.protocol){
            //ログインするときの処理
            case "login":
                data = message.data;
                result = login(data);
                if (result.result == "succeeded"){
                    //ログイン出来たらフラグをtrueにする
                    sockets.socketid.logined = true
                }else if(result.result == "unverified"){
                    //なんかメール送る処理

                }
                //JSON文字列にして返送
                io.to(socket.id).emit('personal',JSON.stringify(result));
        }
        
        

        //全員に配信する
        //io.emit('message', msg);

        //特定のIDに配信（ここでは送ってきたIDに返信）
        //io.to(socket.id).emit('personal', 'PERSONAL');
        //console.log('id: ' + socket.id)
    });
});

http.listen(3000, function () {
    console.log('server start @3000 port');
});
function login(data){
    //ユーザー情報取得
    gainedUserInfo = getuserinfo(data.id);
    //パスワード正しいかな
    if (data.hashedPassword == gainedUserInfo.password){
        //メール認証されてるかな
        if (gainedUserInfo.varified){
            return {result:"succeeded"};
        }else{
            return {result:"unvarified"};
        }
    }else{
        return {result:"faild"};
    }

}
function getuserinfo(userid){
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'info'
    })
    con.query('SELECT * FROM info WHERE userid = ?',
    [userid],
    (err, rows) => {
        if(err){
            //なんかエラー
            return {hashedPassword:""};
        }
        if(rows.length == 0){
            //ユーザーが見つかりません
            return {hashedPassword:""};
        }else if(rows.length > 1){
            //重複登録がある
            return {hashedPassword:""};
        }else{
            return rows[0];
        }
    });
}