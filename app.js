const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', (socket) => {
    console.log('user connected!');
    socket.on('disconnect', () => {
        console.log('User disconnected!');
    });
    socket.on('chat', (message) => {
        console.log('message: ' + message);
        io.emit('chat', message);
    });
    socket.on('typing', (check) => {
        io.emit('typing', check);
    });
});

server.listen(3000, () => {
    console.log('Server connected at http://localhost:3000');
});