const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server);
const bodyParser = require('body-parser');
const cookiePaser = require('cookie-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiePaser());

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.get('/', (req, res) => {
    if(req.cookie('email_address') != ""){
        res.sendFile(__dirname + '/index.html')
    }else{
        res.redirect('/login')
    }
});

//Login User & Simply save cookie
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
});
app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(email != "" && password != ""){
        res.cookie('email_address', email+'-'+makeid(25))
        res.redirect('/');
    }
});

// Signup User (Doesn't work for now)
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html')
});
app.post('/signup', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let password_confirmation = req.body.password_confirmation;
    res.send(`Email: ${email} Password: ${password} Password_Confirmation: ${password_confirmation}`);
});

// Logout User
app.post('/logout', (req, res) => {
    res.clearCookie('email_address');
    res.redirect('/login');
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
        io.emit('chat', message);
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