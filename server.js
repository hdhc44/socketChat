var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();


app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app).listen(8080, ()=>{
    console.log('Server Running');
});

app.get('/', (req,res)=>{
    fs.readFile('index.html',(error, data)=>{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

var io = socketio.listen(server);
io.sockets.on('connection', (socket)=>{
    var roomName = null;
    socket.on('join',(data)=>{
        roomName = data;
        socket.join(data);
    });
    socket.on('message',(data)=>{
        io.sockets.in(roomName).emit('message', data);
    });
    // socket.on('toclient', (name, text)=>{
    //     console.log(name + ":" + " " + text);
    // });
});