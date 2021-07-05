const mongo = require('mongodb').MongoClient;

// Suppose the chat messages are in BSON format below and inserted into collection named "messages":
// "event": {
//    "type": "message",
//    "channel": "D024BE91L",
//    "user": "U2147483697",
//    "text": "content",
//    "thread": ""
//    "ts": "1355517523.000005"
//    "message-id": "hogehoge"
// }



class DBmanager{
    constructor() {
        //mongoDB settings
        this.mongodb_obj = null;
        this.dbURL_mongo = "mongodb://localhost:27017";
        this.mongo_db_name = "TouchaTest";
        this.isConnectedtoMongoDB = false;

        this.cl_chat = "cl_chat";
        this.cl_rooms = "cl_rooms";
        this.cl_users = "cl_users";
    }


    async connect(onSuccess = function(){}, onFailure = function(){}){
        console.log("Connecting......");
        try {
            var connection = await mongo.connect(this.dbURL_mongo, { useUnifiedTopology: true } );
            this.mongodb_obj = connection.db(this.mongo_db_name);
            this.isConnectedtoMongoDB = true;
            console.log(".--------------------------------  MongoClient Connection successfull   .---------------------------------");
            onSuccess();
        } catch(ex) {
            console.log(".--------------------------------  MongoClient Connection Error   .---------------------------------");
            onFailure(ex);
        }
        console.log("Connetction Succedd!!")

        /*
        const MongoClient = require('mongodb').MongoClient;
        const assert = require('assert');

        const mongo_dbName = 'myproject';
        const client = new MongoClient(this.dbURL_mongo);

        //サーバーに接続する 
        client.connect(function(err) {
            assert.strictEqual(null, err);
            console.log("Connected successfully to server");
            const mongo_db = client.db(dbName);

            // usersコレクションを作成し、そこにアクセスする。
            this.mongodb_obj.collection(this.cl_chat) = mongo_db.collection('messages');
            this.mongodb_obj.collection(this.cl_users) = mongo_db.collection('users');
            this.mongodb_obj.collection(this.cl_rooms) = mongo_db.collection('rooms');

            this.mongodb_obj.collection(this.cl_chat).deleteMany({});
        });
        */

        // tables
        // this.tb_users = null;
        // this.tb_rooms = null;
        // this.tb_hoge  = null;
    }


    getDB(){
        return this.mongodb_obj;
    }

    

    //------------------------------   データベースにテスト用データを挿入  --------------------------------------------
    async clearMongoDB(){
        // while(!this.isConnectedtoMongoDB){ console.log("Not connected to Mongo DB"); return false};

        //mongodbの中のすべてのデータを削除
        this.mongodb_obj.collection(this.cl_chat) .deleteMany({})
        this.mongodb_obj.collection(this.cl_rooms).deleteMany({})
        this.mongodb_obj.collection(this.cl_users).deleteMany({})
        console.log("cleared data!");
    }


    async clearMySQLDB(){}

    async addTestData(){
        // while(!this.isConnectedtoMongoDB){ console.log("Not connected to Mongo DB"); return false};

        // Room List:
        const user_list = [
            {id:"id1", name:"user1", hashed_password:"password01", isVerify:"ok", iconURL:"user-circle"},
            {id:"id2", name:"user2", hashed_password:"password02", isVerify:"ok", iconURL:"user-circle"},
            {id:"id3", name:"user3", hashed_password:"password03", isVerify:"ok", iconURL:"user-circle"},
            {id:"id4", name:"user4", hashed_password:"password04", isVerify:"ok", iconURL:"user-circle"},
            {id:"id5", name:"user5", hashed_password:"password05", isVerify:"ok", iconURL:"user-circle"},
            {id:"id6", name:"user6", hashed_password:"password06", isVerify:"ok", iconURL:"user-circle"},
            {id:"id7", name:"user7", hashed_password:"password07", isVerify:"ok", iconURL:"user-circle"},
            {id:"id8", name:"user8", hashed_password:"password08", isVerify:"ok", iconURL:"user-circle"},
            {id:"id9", name:"user9", hashed_password:"password09", isVerify:"ok", iconURL:"user-circle"},
        ];

        var room_list = [
            {id : "rid1", name:"room1", icon_name:"user-circle", lastmsg:"Hello room 1", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid2", name:"room2", icon_name:"user-circle", lastmsg:"Hello room 2", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid3", name:"room3", icon_name:"user-circle", lastmsg:"Hello room 3", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid4", name:"room4", icon_name:"user-circle", lastmsg:"Hello room 4", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid5", name:"room5", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid6", name:"room6", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid7", name:"room7", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid8", name:"room8", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid9", name:"room9", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]},
            {id : "rid10", name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", user_list:["id1", "id2", "id3", "id4", "id5"]}
        ];

        var messages = [
            { direction:'left', usrIconURL:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", text:"いかりしんじ、エヴァに乗れ！！", reactions:"" }, 
            { direction:'left', usrIconURL:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", text:"でなければ、、帰れ！", reactions:"" }, 
            { direction:'left', usrIconURL:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", text:"やっはろーーーーーあああああああああああああああ", reactions:"" }, 
            { direction:'right', usrIconURL:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", text:"わけがわからないよわけがわからないよわけがわからないよわけがわからないよわけがわからないよ", reactions:"" }, 
            { direction:'left', usrIconURL:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", text:"いかりしんじ、エヴァに乗れ！！", reactions:"" }, 
            { direction:'right', usrIconURL:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", text:"逃げちゃだめだ、逃げちゃだめだ、逃げちゃだめだ、逃げちゃだめだ、逃げちゃだめだ！！！！", reactions:"" },
            { direction:'left', usrIconURL:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", text:"リアクションサンプル：", reactions:"" }
        ];

        this.mongodb_obj.collection(this.cl_users).insertMany(user_list);
        this.mongodb_obj.collection(this.cl_rooms).insertMany(room_list);

        for (var i = 0; i < room_list.length; i++) {
            this.mongodb_obj.collection(this.cl_chat).insertOne({ id : room_list[i].id, msgs : messages}, function(err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                    client.close();
                }
            });
        }
    }

    //-------------------------------------------------------------------------------------------

    getLast50Msgs(room_id, _res={val:""}){
        var res = []
        this.mongodb_obj.collection(this.cl_chat).find({ id : room_id }).toArray((error, docs)=>{
            console.log(docs);
            // for (var i = 0; i < Math.min(10, 50); i++) {
                res = docs[0].msgs;
            // }
            _res.val = res;
            // console.log(res);
            return res;
        });

        // mongo.connect(this.dbURL_mongo, (error, db) => {
        //     this.mongodb_obj.collection(this.cl_chat).find({ room_id }).toArray((error, docs)=>{
        //         for (var i = 0; i < 50; i++) {
        //             res += docs[i].text;
        //             console.log(docs[i].text);
        //         }
        //     });
        // });    
    }

    async getAaall(){
        await this.mongodb_obj.collection(this.cl_chat).find({}).toArray((error, docs)=>{
            console.log(error, docs);
        });

        await this.mongodb_obj.collection(this.cl_rooms).find({}).toArray((error, docs)=>{
            console.log(error, docs);
        });

        await this.mongodb_obj.collection(this.cl_users).find({}).toArray((error, docs)=>{
            console.log(error, docs);
        });
    }



    // ユーザーがそのルームに参加しているか調べる
    isUserInRoom(user, room_id){
        this.mongodb_obj.collection(this.cl_rooms).find({ roomid : room_id }).toArray((error, res)=>{
            if(res.length == 0){
                console.log("no such room id = " + room_id );
                return false
            }
            console.log(res[0].user_list);
            if(res[0].user_list.includes(user)){
                console.log("User is in room!!");
            }else{
                console.log("user not in room!!");
            }
        });
    }


// ####################################  ここからコピペ  ##########################################################
    // JS cannot designate JSON as arguments
    // => every data to pass has to be parsed using JSON.parse('event')

    async post_message(parsed_event) {
        mongo.connect(this.dbURL_mongo, (error, db) => {
            const collection = db.collection('messages');
            collection.insertOne(JSON.stringify(parsed_event), (error, result) => {
                db.close();
            });
        });
    }
}


function sleep(ms) { return new Promise(resolve => { setTimeout(resolve, timeout=ms); }) }

const oo = new DBmanager();
oo.connect();


const prompt = require('prompt');

prompt.start();
console.log("Insert command --> ");
prompt.get(['cmd'], function (err, result) {
        console.log("insert test data...");
        oo.clearMongoDB();
        oo.addTestData();
    // for(var i=0; i< 1000000000; i++){var j = 0; j = j*j*j*j*j; }
    //     // oo.getAaall();
    //     console.log("Test functinos..");

    //     var res = {val : null}
    //     console.log(oo.getLast50Msgs("id3", res));
    //     console.log(res);;
    //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        // console.log(oo.isUserInRoom("id1", "rid2"));

        // console.log("END!");
});



module.exports = DBmanager;

