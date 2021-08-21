
export default class Client {
    constructor() {
        this.url = 'http://192.168.3.2:3000'
    }

    async post(path, msg) {
        return fetch(this.url.concat('', path), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(msg)
        })
    }
}

