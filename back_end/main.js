const { appendFileSync } = require('fs');
const __mydb = require("./database");
const DBManager = new __mydb()

// expressも使うように変更
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// ↓CORSエラー対策。 TODO:実機実装後は削除予定？
// const cors = require('cors');
// app.use(cors());

// ↑で動作しなかったので↓にした
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


// JSONでHTTPRequestのデータをパース
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// locahostで動かなかったので→リンクを見ながらちょっと修正：https://gist.github.com/luciopaiva/e6f60bd6e156714f0c5505c2be8e06d8
// const {Server} = require('socket.io');
// const io = new Server(3000);


// 現在Verifyされているチャットルーム用のソケットのリスト
class sockUsers{
    constructor(sock_type_){
        this.sock_type_ = sock_type_;
        this.user_list = [];
    }

    getUserInfo(sockObj_){
        this.user_list.forEach(ul => {
            if(ul.sockObj === sockObj_){
                return ul;
            }
        });
        console.log("[ DEBUG ] Socketに該当するUserはいません")
        return null;
    }

    addUser_room_type(sockObj_, userid_, room_id_, login_){
        if(this.getUserInfo(sockObj_) !== null){
            console.log("[ ERROR ] そのユーザーはすでに登録済みです")
        }else{
            this.user_list.push({
                sockObj : sockObj_,
                user_id : userid_,
                room_id : room_id_, 
                login : login_
            })
            console.log("[ INFO ] ユーザーを登録しました")
        }
    }

    printAllUsers(){
        console.log("---------------------- ↓ Socket User List  ↓  --------------------------")
        this.user_list.forEach(i => { console.log(i.user_id, i.room_id, i.login) });   
        console.log("---------------------- ↑ Socket User List  ↑ --------------------------")
    }

    deleteUser(sockObj_){
        for(var i = 0; i < this.user_list.length; i++){
        if(this.user_list[i] === undefined){
            console.log("[ DEBUG ] 不正なユーザーキーを削除しました（React Nativeを起動したままサーバーをリセットするとこれが発生する）")
            delete this.user_list[i];
        }else if(!this.user_list[i].hasOwnProperty('sockObj') ){
            delete this.user_list[i];
            console.log("[ DEBUG ] 不正なユーザーキーを削除しました（React Nativeを起動したままサーバーをリセットするとこれが発生する）")
        }else if(this.user_list[i].sockObj === sockObj_){
                delete this.user_list[i];
                console.log("[ INFO ] ユーザーをSocketリスト一覧から削除しました")
                return true;
            }
        }
        console.log("[ ERROR ] Socketに該当するUserはいません")
        return false;
    }

    getSockInfoList(user_id_){
        var result = [];
        this.user_list.forEach(ul => {
            if(ul.user_id === user_id_){ result.push(ul); }
        });
        return result;
    }
}

var sock_users = new sockUsers();

DBManager.connect();


app.get('/', function (req, res) {
  res.send("Hello world!!");
});


app.post("/api/getLast50msg", function(req, res){
    if(!req.body.hasOwnProperty("room_id")){
        console.log("No argument room_id");
        res.send(JSON.stringify({status:"error", description:"No argument-room_id"}))
        return;
    }
    var room_id = req.body.room_id;

    var result = []
    var dbObj = DBManager.getDB();
    dbObj.collection("cl_chat").find({ id : room_id }).toArray((error, docs)=>{
        if(docs.length === 0){
            console.log("[ ERROR ] No room -> " + room_id);
            res.send(JSON.stringify({status:"error", description:"Invalid room_id " + room_id}))
            return;
        }

        console.log("get - /api/getLast50msg - 200 OK");
        // for (var i = 0; i < Math.min(10, 50); i++) {
            result = docs[0].msgs;
        // }
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.send(JSON.stringify(result));
    });

    // mongo.connect(this.dbURL_mongo, (error, db) => {
    //     this.mongodb_obj.collection(this.cl_chat).find({ room_id }).toArray((error, docs)=>{
    //         for (var i = 0; i < 50; i++) {
    //             res += docs[i].text;
    //             console.log(docs[i].text);
    //         }
    //     });
    // });    
});


app.post("/api/getInfo", function(req, res){
    if(!req.body.hasOwnProperty("room_id")){
        console.log("No argument room_id");
        res.send(JSON.stringify({status:"error", description:"No argument-room_id"}))
        return;
    }
    var userid = req.body.user_id;

    var dbObj = DBManager.getDB();
    dbObj.collection("cl_users").find({ id : userid }).toArray((error, docs)=>{
        if(docs.length === 0){
            console.log("[ ERROR ] No room -> " + room_id);
            res.send(JSON.stringify({status:"error", description:"Invalid room_id " + room_id}))
            return;
        }
        result = docs[0].msgs;
        res.send(JSON.stringify(result));
    });

})


io.on('connection',function(socket){

console.log('connected!');

// ソケット接続語、ログイン（ユーザー認証）を行う
socket.on('login', function(msg){
    var message = JSON.parse(msg);
    console.log("checking new user --> " + message.userid + " , " + message.hashed_pass); 

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
                    sock_users.addUser_room_type(socket, message.userid, message.room_id, false);
                    return false
                }
                console.log(res[0].user_list);
                if(res[0].user_list.includes(message.userid)){
                    console.log("User is in room!!")
                    socket.emit("login-verify", "login-accepted");
                    sock_users.addUser_room_type(socket, message.userid, message.room_id, true);
                }else{
                    console.log("user not in room!!");
                    sock_users.addUser_room_type(socket, message.userid, message.room_id, false);
                }
            });
        }
    });

        // チェック処理
        // socket.emit("login-verify", "login-error");
    });

    socket.on("leave-room", (msg) => {
        console.log("leave room!!! --> ");
        sock_users.deleteUser(socket);
        // TODO : chat_socket_list.delete(hoge)
    });


    socket.on('message',function(msg){
        var msg_parsed = JSON.parse(msg);
        console.log("get new message!");
        console.log(msg_parsed);
        console.log("-----------------------------------------------");

        var dbObj = DBManager.getDB()
        dbObj.collection("cl_rooms").find({ id : msg_parsed.room_id }).toArray((error, res)=>{
            if(res.length == 0){
                console.log("[ ERROR ] no such room id = " + msg_parsed.room_id );
                return false
            }
            sock_users.printAllUsers();

            (res[0].user_list).forEach(us => {
                sock_list_tmp = sock_users.getSockInfoList(us);
                sock_list_tmp.forEach(slt => {
                    if(slt.sockObj !== socket){
                        slt.sockObj.emit("message", JSON.stringify(msg_parsed));
                        console.log("send message to  --> " + us);
                    }
                });
            });
            console.log("end");
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



http.listen(3000, function () {
    console.log('start');
});

