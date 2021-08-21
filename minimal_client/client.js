const request = require("request");
const io = require("socket.io-client")
const http = require('http')

class Client {
    constructor() {
        this.url = 'http://localhost:3000'
    }

    // サーバーへPOSTする関数
    async _requestToServer(path, msg, callback) {
        let postData = msg
        let postDataStr = JSON.stringify(postData)
        let req = http.request({
            // url: this.url.concat('', path),
            // port: 3000,
            host: 'localhost',
            port: 3000,
            path: path,
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postDataStr)
            },
            method: 'POST',
        }, (res) => {
            res.setEncoding('utf8');
            res.on('data', (data) => {
                callback(JSON.parse(data))
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })
        req.write(JSON.stringify(msg))
        req.end()
    }

    // メールアドレスと、パスワードを送信することによって、アクセストークンを取得
    async login(email, password) {
        await this._requestToServer('/login', { email: email, password: password }, (msg) => { console.log(msg) })
    }

    // emailに紐付いたtokenを作成、email宛にtokenを送信
    async requestToken(email) {
        this._requestToServer('/requestToken', { email: email })
    }

    // Test関数
    async test() {
        await this.login('1273487879@euh.com', 'hohenauha')
        // await requestToken('touchatest1432@gmail.com')
    }
}


async function run() {
    var client = new Client()
    client.test()

    // Socket Pathを指定すること
    var socket = io("http://localhost:3000", {
        // reconnectionDelayMax: 10000,
        // transports: ['websocket']
    });

    // Test関数
    socket.on('connect', (socket) => {
        console.log('Socket.io has Connected');
    });

    socket.on('disconnect', () => {
        console.log('Socket.io has Disconnected')
    })

    socket.emit('test', 'this is test message')
}

run()

module.exports = { client: Client }
