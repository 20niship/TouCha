// Copyright 2021, Fujimoto Gen
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').createServer(app)
const fs = require('fs')

// 使う定数を指定
const PORT = 3000
const uri = 'mongodb://localhost:27017' // Mongodbのサーバー
const testUsers_json = JSON.parse(fs.readFileSync('./TestData.json', 'utf-8'))
const DataBase = require('./utils').database
const Mailer = require('./utils').mailer

const io = new require('socket.io')(server)

const http = require('http')

async function run() {
    var database = new DataBase()
    // ========================================== TEST ============================================
    await database.connect()
    await database.clearDatabase()
    for (let i of testUsers_json['users']) {
        await database.addUser(i['name'], i['email'], i['password'])
    }

    var num = await database.createToken('testmail@gmail.com')
    console.log(await database.isValidToken('testmail@gmail.com', num))
    await database.userAuthentication("123456879@euh.com", "haoetuoehuh")
    // ============================================================================================

    // HTTP
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/', async (req, res) => {
        res.send('Welcome To Toucha Server')
    })

    app.post('/test', async (req, res) => {
        console.log(req.body)
        res.send({ send: 'data' })
    })

    // Login 処理
    app.post('/login', async (req, res) => {
        console.log('login request has accepted')
        console.log(req.body)
        console.log(await database.userAuthentication(req.body.email, req.body.password))
        res.send({ body: 'yayy' })
    })

    app.post('/requestToken', async (req, res) => {
        console.log('Token request has accepted')
        database.createToken(req.body.email)
    })

    app.post('/createAccount', async (req, res) => {
        console.log(req.body)
        res.send('accepted')
    })


    // Socket.io
    // Attach
    io.sockets.on('connect', (socket) => {
        console.log('Socket io has Connected')
        io.sockets.on('disconnect', () => {
            console.log('Socket io has Disconnected')
        })

        socket.on("test", (msg) => {
            console.log(msg)
        })
    })

    io.of('socketTest').on('connect', (socket) => {
        console.log('Soket has connected to socketTest')

        socket.on('disconnect', () => {
            console.log('Socket has Disconnected from socketTest')
        })

        socket.on('test', (msg) => {
            console.log(msg)
        })
    })

    // Server Deploy
    server.listen(PORT, () => {
        console.log('server has deployed on http://localhost:3000')
    })
}

run()

