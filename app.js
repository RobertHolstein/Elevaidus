const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/world1', (req, res) => {
    res.sendFile(__dirname + '/public/world1.html');
});

app.get('/world2', (req, res) => {
    res.sendFile(__dirname + '/public/world2.html');
});

app.get('/world3', (req, res) => {
    res.sendFile(__dirname + '/public/world3.html');
});

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('messagesReceive', `New user joined ${data.room} room!`);
    });

    socket.on('messagesPush', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('messagesReceive', data.msg);
    });

    socket.on('disconnect', () => {
        tech.emit('messagesReceive', 'user disconnected');
    });
});
