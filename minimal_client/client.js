var request = require("request");

async function requestToServer(path, data) {
    request({
        url: 'http://localhost:3000'.concat('', path),
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
async function login(email, password) {
    console.log(await requestToServer('/test', { name: 'data' }))
}

login()
