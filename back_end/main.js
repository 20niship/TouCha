var PORT = 3000;

var http = require('http');
var fs   = require('fs');
var path = require('path');
var socketio = require('socket.io');

var mime = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript"
};

var server = http.createServer(function(request, response) {

    var filePath = (request.url == '/')? '/index.html' : request.url;
    var fullPath = __dirname + filePath;

    response.writeHead(200, {'Content-Type' : mime[path.extname(fullPath)] || "text/plain"});
    fs.readFile(fullPath, function(err, data) {
        if(!err) {
            response.end(data, 'UTF-8');
        }
    })

}).listen(PORT);

var io = socketio(server);

io.on('connection', function(socket) {
    socket.on('client_to_server', function(data) {
        io.emit('server_to_client', {value : data.value});
    });
});

console.log("Server started at port: " + PORT);


