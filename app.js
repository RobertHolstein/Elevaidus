var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const PORT = 3001;

var players = {};
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
server.listen(PORT, function () {
  console.log(`Listening on ${server.address().port}`);
});

io.on('connection', function (socket) {
    console.log('a user connected');
    players[socket.id] = {
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        sprite: 'charactor',
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);
      
    socket.on('disconnect', function () {
      console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
    });
});