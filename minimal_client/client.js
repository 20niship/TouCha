const request = require("request");
const io = require("socket.io-client")

class Client {
    constructor() {
        this.url = 'http://localhost:3000'
    }

    // サーバーへPOSTする関数
    async _requestToServer(path, data) {
        request({
            url: this.url.concat('', path),
            headers: {
                "content-type": "application/json"
            },
            method: 'POST',
            json: true,
            body: data
        }, (err, res, body) => {
            var data = body
        })
        return data
    }

    // メールアドレスと、パスワードを送信することによって、アクセストークンを取得
    async login(email, password) {
        console.log(await this._requestToServer('/login', { email: email, password: password }))
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
