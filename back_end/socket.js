const { appendFileSync } = require('fs');
const { userInfo } = require('os');

// locahostで動かなかったので→リンクを見ながらちょっと修正：https://gist.github.com/luciopaiva/e6f60bd6e156714f0c5505c2be8e06d8
const {Server} = require('socket.io');
const io = new Server(3000);

var chat_socket_list = [] // 現在Verifyされているチャットルーム用のソケットのリスト
var notification_socket_list = [] // 通知を送るために接続されているソケットのリスト

io.on('connection',function(socket){
    console.log('connected!');
    // var socketId = socket.id;
    //chat_socket_listにIDをKeyにして情報を入れる
    chat_socket_list.push(
        {
            socket_obj: socket,
            logined : false,
            user : "",
            pass : "" //　必要？
        }
    );
    // ソケット接続語、ログイン（ユーザー認証）を行う
    socket.on('login', function(msg){
        console.log(msg);
        var message = JSON.parse(msg);

    });

    socket.on('message',function(msg){
        console.log(msg);
        var aaaaaaaaa = JSON.parse(msg);
        console.log("get new message!");
        console.log(aaaaaaaaa);
        console.log("-----------------------------------------------");

        //msg.protocolの内容で処理を分岐
        /*
        switch (message.protocol){
            //ログインするときの処理
            case "login":
                data = message.data;
                console.log(data)
                result = login(data);
                if (result.result == "succeeded"){
                    //ログイン出来たらフラグをtrueにする
                    chat_socket_list.id.logined = true
                }else if(result.result == "unverified"){
                    //なんかメール送る処理

                }
                //JSON文字列にして返送
                io.to(socket.id).emit('personal',JSON.stringify(result));
        }
        
        */
        //全員に配信する
        //io.emit('message', msg);

        //特定のIDに配信（ここでは送ってきたIDに返信）
        //io.to(socket.id).emit('personal', 'PERSONAL');
        console.log('id: ' + socket.id)
    });
});

function login(data){
    //ユーザー情報取得
    gainedUserInfo = getuserinfo(data.id);
    //パスワード正しいかな
    if (data.hashedPassword == gainedUserInfo.password){
        //メール認証されてるかな
        if (gainedUserInfo.varified){
            return {result:"succeed"};
        }else{
            return {result:"unvarified"};
        }
    }else{
        return {result:"faild"};
    }

}
function getuserinfo(id){
    //テスト用
    return {
        password:"hoge",
        varified:true
    }
    //てすとここまで
}

