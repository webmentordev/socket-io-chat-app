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
    // Generate Random Number as User
    const user = Math.floor(Math.random() * 3000000);

    console.log('user connected!' + user);
    
    //User Randmon Number as userID
    io.emit('user_info', user);

    //Send message on user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected!');
    });

    //Send message to the user
    socket.on('chat', (message) => {
        console.log('message: ' + message);
        io.emit('chat', message, user);
    });

    //Check if user is typing
    socket.on('typing', (check) => {
        io.emit('typing', check);
    });

});

// Start CHAT-Server on Port 3000
server.listen(3000, () => {
    console.log('Server connected at http://localhost:3000');
});