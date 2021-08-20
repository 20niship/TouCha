// Copyright 2021, Fujimoto Gen
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').createServer(app)
// const { Server } = require("socket.io")
const io = new require('socket.io')(server)
const fs = require('fs')

// 使う定数を指定
const PORT = 3000
const uri = 'mongodb://localhost:27017' // Mongodbのサーバー
const testUsers_json = JSON.parse(fs.readFileSync('./TestData.json', 'utf-8'))
const DataBase = require('./utils').database
const Mailer = require('./utils').mailer



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

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.send('Welcome To Toucha Server')
    })

    app.post('/test', (req, res) => {
        console.log(req.body)
        res.send({ send: 'data' })
    })

    // Login 処理
    app.post('/login', (req, res) => {
        console.log(req.body)
        res.sed('accepted')
    })

    app.post('/createAccount', (req, res) => {
        console.log(req.body)
        res.sed('accepted')
    })

    // Server Deploy
    server.listen(PORT, () => {
        console.log('server has deployed on http://localhost:3000')
    })
}

run()

