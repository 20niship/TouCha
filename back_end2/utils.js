const mongodb = require('mongodb')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const { createHash } = require('crypto');
const nodemailer = require('nodemailer')

// メールを送るクラス
class Mailer {
    constructor() {
        this.testAccount = nodemailer.createTestAccount()
        this.transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "touchatest1432@gmail.com",
                pass: "touchates123"
            }
        })
    }

    async send(msg) {
        await this.transport.sendMail({
            from: 'touchatest1432@gmail.com', // sender address
            to: "touchatest1432@gmail.com", // list of receivers
            subject: "From Toucha_test", // Subject line
            text: msg, // plain text body
        });
    }
}

class Hash {
    constructor() {
        this.hashMethod = 'sha256'
    }

    async make(text) {
        var hash = createHash(this.hashMethod)
        hash.update(text)
        return hash.digest('hex')
    }
}

// データーベースを扱うクラス
class DataBase {
    constructor() {
        this.bd = null // Database
        this.uri = 'mongodb://localhost:27017'
        this.db_name_test = 'toucha_test'
        this.db_name = 'Toucha_test'
        this.accessCode = null
        this.server = null
        this.tokens = null
        this.users = null
        this.rooms = null
        this.talks = null
        this.hash = new Hash()
    }

    // MongoDBのデータベースとの接続処理をする
    async connect() {
        try {
            console.log('connecting ...')
            const client = mongodb.MongoClient
            this.server = await client.connect(this.uri,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
            console.log(`MongoDB Connected: ${this.uri}`); // MongoDBサーバーに接続
            this.db = this.server.db(this.db_name) // Databaseの登録
            this.tokens = this.db.collection('tokens')
            this.accessCode = this.db.collection('accessCode')
            this.users = this.db.collection('users')
            this.rooms = this.db.collection('rooms')
            this.talks = this.db.collection('talks')
        } catch (err) {
            console.error(err)
            console.error('It seems that Mongodb Server has not been runnnig, please check Mongodb daemon')
        }
    }

    // データーベースの全消去、注意して使う
    async clearDatabase() {
        this.db.dropDatabase()
        console.log(`Database ${this.db_name} has been deleted`)
    }

    // ユーザー追加関数
    async addUser(username, mail, password) {
        try {
            if (await this.users.findOne({ username: username })) {
                throw "This Username has been taken"
            } else {
                await this.users.insertOne({
                    uuid: uuidv4(),
                    userID: null,
                    mailadress: mail,
                    username: username,
                    hashedPassWord: await this.hash.make(password),
                    friend_list: "test"
                })
            }
            console.log('user data has inserted')
        } catch (e) {
            console.log(e)
        }
    }

    // メールに紐ついたTokenを発行し、mail宛にメールを送る
    async createToken(mail) {
        var date = new Date()
        var token = Math.floor(100000 + Math.random() * 900000)
        var mailer = new Mailer()
        try {
            await this.tokens.insertOne({
                date: date,
                email: mail,
                token: token,
                expired: true // 有効か無効か判定
            })
            console.log('Token has been issued')
        } catch (err) { console.log(err) }
        // mailer.send(token.toString()) // 送るメッセージの件名を考えること。 TODO

        return token
    }

    // tokenが有効かどうかを判定する
    async isValidToken(mail, token) {
        var match = await this.tokens.findOne({ email: mail })
        if ((new Date() - match['date'] < 1000 * 60 * 30) && (match['token'] == token) && match['expired']) {
            return true
        } else {
            return false
        }
    }

    // ユーザーログインの認証に使う
    async userAuthentication(mail, password) {
        var match = await this.users.findOne({ email: mail })
        console.log(match)
        var accessCode = uuidv4()
        this.accessCode.insertOne({
            accessCode: accessCode,
            email: mail,
            date: new Date(),
            expired: false
        })
        return accessCode
    }

    async findUser(name) {
        try {
            return await this.users.findOne({ username: name })
        } catch (err) { console.log(err) }
    }

    async findRoom() {
    }

    async filterTalks() {
    }
}

module.exports = { mailer: Mailer, database: DataBase }
