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

    async send(email, subject, msg) {
        await this.transport.sendMail({
            from: 'touchatest1432@gmail.com', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: msg, // plain text body
        });
    }
}

// Hashを作成するクラス
class _Hash {
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
        this.hash = new _Hash()
    }

    // MongoDBのデータベースとの接続処理をする
    async connect() {
        try {
            console.log('connecting ...')
            const client = mongodb.MongoClient
            this.server = await client.connect(this.uri, {
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
    async addUser(username, email, password) {
        try {
            if (await this.users.findOne({ username: username })) {
                throw "This Username has been taken"
            } else {
                await this.users.insertOne({
                    uuid: uuidv4(),
                    userID: null,
                    email: email,
                    username: username,
                    hashedPassWord: await this.hash.make(password),
                    isVerified: false,
                    room_list: [],
                    friend_list: []
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    // メールに紐ついたTokenを発行し、mail宛にメールを送る
    async createToken(email) {
        var date = new Date()
        var token = Math.floor(100000 + Math.random() * 900000)
        var mailer = new Mailer()
        try {
            await this.tokens.insertOne({
                date: date,
                email: email,
                token: token,
                expired: true // 有効か無効か判定
            })
        } catch (err) { console.log(err) }
        mailer.send(email, 'Token Request', token.toString()) // 送るメッセージの件名を考えること。 TODO
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
    async userAuthentication(email, password) {
        try {
            var match = await this.users.findOne({ email: email })
            if (!match) {
                // emailが登録されていない場合1を投げる
                throw 1
            } else if (!(await match.hashedPassWord == await this.hash.make(password))) {
                // passwordが一致していない場合2を投げる
                console.log('OK')
                throw 2
            } else {
                // 上以外の場合はacccessCodeを作成し、返り値としてaccessCodeを返す
                var accessCode = uuidv4()
                await this.accessCode.insertOne({
                    accessCode: accessCode,
                    email: email,
                    date: new Date(),
                    expired: false
                })
                return accessCode
            }
        } catch (err) {
            return err
        }
    }

    // ユーザーを探す
    async findUser(name) {
        try {
            return await this.users.findOne({ username: name })
        } catch (err) { console.log(err) }
    }

    // ルームを探す
    async findRoom() {
    }

    // トークにフィルターをかける
    async filterTalks() {
    }
}

module.exports = { mailer: Mailer, database: DataBase }
