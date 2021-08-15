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
        collection.find({ user: userId }).toArray((error, docs) => {
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
