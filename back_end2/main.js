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
        await database.users.insertOne({
            userUUID: i["userUUID"],
            userID: null,
            email: i["email"],
            username: i["username"],
            hashedPassWord: await database.hash.make(i["password"]),
            roomList: i["roomList"],
            friendList: i["friendList"]
        })
    }

    for (let i of testUsers_json['rooms']) {
        await database.rooms.insertOne({
            roomUUID: i["roomUUID"],
            roomname: i["roomname"],
            roomIcon: i["roomIcon"],
            status: i["status"],
            type: i["type"],
            userList: i["userList"]
        })
    }

    for (let i of testUsers_json['messages']) {
        await database.messages.insertOne({
            roomUUID: i["roomUUID"],
            userUUID: i["userUUID"],
            body: i["body"],
            reactions: i["reactions"],
            date: new Date()
        })
    }

    // ============================================================================================

    // HTTP
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/', async (req, res) => {
        res.send('Welcome To Toucha Server')
    })

    // Login 処理
    app.post('/login', async (req, res) => {
        var status = await database.userAuthentication(req.body.email, req.body.password)
        console.log(status)
        res.send(status)
    })

    app.post('/requestToken', async (req, res) => {
        console.log('Token request has accepted')
        var result = await database.createToken(req.body.email, req.body.anyway)
        res.send(result)
    })

    app.post('/emailAuthentication', async (req, res) => {
        console.log('Email Authentication Request has accepted')
        res.send(JSON.stringify({ status: await database.verifyToken(req.body.email, req.body.token) }))
    })

    app.post('/createAccount', async (req, res) => {
        console.log(req.body)
        var status = await database.createAccount(
            req.body.username,
            req.body.email,
            req.body.password,
            req.body.token)
        res.send(status)
    })

    app.post('/checkAccessCode', async (req, res) => {
        console.log('AccessCode')
        console.log(req.body.accessCode)
        res.send(await database.checkAccessCode(req.body.accessCode))
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


    server.listen(PORT, () => {
        console.log('server has deployed on http://localhost:3000')
    })
}

run()

