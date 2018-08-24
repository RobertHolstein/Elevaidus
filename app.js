const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3005;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.static('public'))

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

const game = io.of('/game');
var players = {};


game.on('connection',function(socket){
    console.log('A user connected...')
    socket.on('newplayer', () => {
        players[socket.id] = {
            playerId: socket.id,
            x: randomInt(100,400),
            y: randomInt(100,400),
            sprite: "charactor"
        };

        socket.emit('updatePlayers', players);
        socket.broadcast.emit('newplayer', players[socket.id]);
    });
 
        // when a player moves, update the player data
    socket.on('playerMovement', function (direction) {
        switch(direction){
            case "down":
                players[socket.id].y += 0.5;
                break;
            case "up":
                players[socket.id].y -= 0.5;
                break;
            case "left":
                players[socket.id].x -= 0.5;
            break;
            case "right":
                players[socket.id].x += 0.5;
                break;
        }
        // emit a message to all players about the player that moved
        socket.emit('playerMoved', players[socket.id]);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
    });
});

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

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
