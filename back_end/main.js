const { appendFileSync } = require('fs');
const { userInfo } = require('os');
const __mydb = require("./database");
const DBManager = new __mydb()

// locahostで動かなかったので→リンクを見ながらちょっと修正：https://gist.github.com/luciopaiva/e6f60bd6e156714f0c5505c2be8e06d8
const {Server} = require('socket.io');
const io = new Server(3000);

var chat_socket_list = [] // 現在Verifyされているチャットルーム用のソケットのリスト
var notification_socket_list = [] // 通知を送るために接続されているソケットのリスト


DBManager.connect();


io.on('connection',function(socket){
    console.log('connected!');
    // var socketId = socket.id;
    //chat_socket_listにIDをKeyにして情報を入れる

    var sock_info = {};
 
    // ソケット接続語、ログイン（ユーザー認証）を行う
    socket.on('login', function(msg){
        var message = JSON.parse(msg);
        console.log("checking new user --> " + message.userid + " , " + message.hashed_pass); 

        sock_info = {
            userid : message.userid,
            room_id : message.room_id,
            user_login : false
        }

        var dbObj = DBManager.getDB();
        dbObj.collection("cl_users").find({ id : message.userid, hashed_password:message.hashed_pass }).toArray((error, res)=>{
            if(res.length == 0){
                console.log("no such user id = " + message.userid );
                socket.emit("login-verify", "login-deny");
                return;
            }else{
                console.log("User Found!!");
                dbObj.collection("cl_rooms").find({ id : message.room_id }).toArray((error, res)=>{
                    if(res.length == 0){
                        console.log("no such room id = " + message.room_id );
                        socket.emit("login-verify", "login-deny");
                        return false
                    }
                    console.log(res[0].user_list);
                    if(res[0].user_list.includes(message.userid)){
                        chat_socket_list.push({ [message.userid]: socket });
                        console.log("User is in room!!")
                        socket.emit("login-verify", "login-accepted");
                        sock_info.user_login = true;
                    }else{
                        console.log("user not in room!!");
                    }
                });
            }
        });

        // チェック処理
        // socket.emit("login-verify", "login-error");
    });

    socket.on('message',function(msg){
        var msg_parsed = JSON.parse(msg);
        console.log("get new message!");
        console.log(msg_parsed);
        console.log("-----------------------------------------------");

        var dbObj = DBManager.getDB()
        dbObj.collection("cl_chat").find({ id : msg_parsed.room_id }).toArray((error, res)=>{
            if(res.length == 0){
                console.log("no such room id = " + msg_parsed.room_id );
                return false
            }
            console.log(res[0].user_list);
            (res[0].msgs).forEach(us => {
                if(chat_socket_list.includes(us)){
                    chat_socket_list[us].emit("message", JSON.stringify(msg_parsed));
                    console.log("send message to  --> " + us);
                }else{
                    console.log("User is not currently in room : " + us);
                }
            });
        });

        socket.on("leave-room", (msg) => {
            console.log("leave room!!! --> " + userInfo);
            // TODO : chat_socket_list.delete(hoge)
        });

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

