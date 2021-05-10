
const mongo = require('mongodb').MongoClient;
const url = ""; // MongoDB database url

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

function get_messages(userId) {
    mongo.connect(url, (error, db) => {
        const collection = db.collection('messages');
        collection.find({ user:userId }).toArray((error, docs)=>{
            for (var i = 0; i < 50; i++) {
                console.log(docs[i].text);
            }
        });
    });
}

// JS cannot designate JSON as arguments
// => every data to pass has to be parsed using JSON.parse('event')


function post_message(parsed_event) {
    mongo.connect(url, (error, db) => {
        const collection = db.collection('messages');
        collection.insertOne(JSON.stringify(parsed_event), (error, result) => {
            db.close();
        });
    });
}

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password'
});
connection.connect((err) => {
    if(err){
        console.log("CONNECTION ERROR");
        return;
    }
    console.log("SUCCESSFULLY CONNECTED");
});
connection.end((err) => {});

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
            return "ERROR";
        }
        if(rows.length == 0){
            return "USER NOT FOUND";
        }else if(rows.length > 1){
            return "REGISTRATION ERROR";
        }else{
            return rows[0];
        }
    });
}

function verifyid(userid){
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'info'
    })
    con.query('SELECT EXISTS(SELECT 1 FROM info WHERE userid = ?',
    [userid],
    (err, rows) => {
        if(err) throw err;
        if(rows[0] == 0){
            return "USER NOT FOUND";
        }
    });
    con.query('UPDATE info set isVerified=true WHERE userid = ?',
    [userid],
    (err, rows) => {
        if(err) throw err;
        return "SUCCESSFULLY VERIFIED";
    });
}