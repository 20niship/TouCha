const mongodb = require('mongodb')
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
        this.messages = null
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
            this.messages = this.db.collection('messages')
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

    // メールに紐ついたTokenを発行し、mail宛にメールを送る tokenを返す
    async createToken(email) {
        var date = new Date()
        var token = Math.floor(100000 + Math.random() * 900000)
        var mailer = new Mailer()
        try {
            await this.tokens.insertOne({
                date: date,
                email: email,
                token: token,
                expired: true, // 有効か無効か判定
                verified: false
            })
        } catch (err) { console.log(err) }
        mailer.send(email, 'Token Request', token.toString()) // 送るメッセージの件名を考えること。 TODO
    }

    // tokenをVerifyする
    async verifyToken(mail, token) {
        try {
            var match = await this.tokens.find({ email: mail })
                .sort({ date: -1 })
                .limit(1)
                .next()
            console.log(match)
        } catch (err) {
            console.log(err)
        }
        // emailがマッチして
        if (match && (new Date() - match['date'] < 1000 * 60 * 30) && (match['token'] == token) && match['expired']) {
            var updateToken = {
                $set: {
                    verified: true
                },
            }
            this.tokens.updateOne({ email: mail, token: token }, updateToken, { upsert: false })
            console.log('This is Valid Token')
            return true
        } else {
            return false
        }
    }

    // ユーザー追加関数
    async createAccount(username, email, password, token) {
        var result = null
        try {
            var match = await this.tokens.find({ email: email, token: token })
                .sort({ date: -1 })
                .limit(1)
                .next()
            console.log(match)
            console.log(email, token)
            if (!match) {
                result = { status: "noToken" }
                throw "no Token has be found"
            } else if (match['isValid'] && match['expired']) {
                result = { status: "invalid" }
                throw "Token has Invalid or Expired"
            } else if (await this.users.findOne({ email: email })) {
                result = { status: "emailRegistered" }
                throw "This username has been Taken"
            } else if (await this.users.findOne({ username: username })) {
                result = { status: "usernameTaken" }
                throw "This username has been Taken"
            } else {
                await this.users.insertOne({
                    userUUID: uuidv4(),
                    userID: null,
                    email: email,
                    username: username,
                    hashedPassWord: await this.hash.make(password),
                    room_list: [],
                    friend_list: []
                })
                var expireToken = {
                    $set: {
                        expired: false
                    }
                }
                this.tokens.updateOne({ _id: match["_id"] }, expireToken, { upsert: false })
                console.log('The New Account Has Created')
                result = { status: "success" }
            }
        } catch (err) {
            console.log(err)
        }
        return result
    }

    // ユーザーログインの認証に使う
    async userAuthentication(email, password) {
        var result = null
        try {
            var match = await this.users.findOne({ email: email })
            if (!match) {
                // Userが見つからない場合
                result = { status: 'noUser', accessCode: null }
                throw "User was not Found"
            } else if (!(await match.hashedPassWord == await this.hash.make(password))) {
                // passwordが一致していない場合
                console.log(await this.hash.make(password))
                console.log(password)
                result = { status: 'invalidPassword', accessCode: null }
                throw "Password is not Correct"
            } else {
                // 上以外の場合はacccessCodeを作成
                var accessCode = uuidv4()
                await this.accessCode.insertOne({
                    accessCode: accessCode,
                    email: email,
                    date: new Date(),
                    expired: false
                })
                result = { status: 'success', accessCode: accessCode }
            }
        } catch (err) {
            console.log(err)
        }
        return result
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
