var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const PORT = 3001;
var routes = require('./routes')(app, server, express, PORT);


var players = {};
 


io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('join', (room) =>{
        socket.join(room);
        console.log(`user ${socket.id} joined room ${room}`)
        var playersInRoom = {};
        players[socket.id] = {
            x: Math.floor(Math.random() * 700) + 50,
            y: Math.floor(Math.random() * 500) + 50,
            playerId: socket.id,
            sprite: 'charactor',
            room: room,
        };
        
        for(var Id in players) {
            if(players[Id].room === room){
                playersInRoom[Id] = {
                    x: players[Id].x,
                    y: players[Id].y,
                    playerId: Id,
                    sprite: players[Id].sprite,
                    room: players[Id].room,
                }
            }
        };
        socket.emit('currentPlayers', playersInRoom);
        socket.to(room).emit('newPlayer', players[socket.id]);
    })
    socket.on('playerMovement', function (direction) {
        switch(direction){
            case "down":
                players[socket.id].y += 1;
                break;
            case "up":
                players[socket.id].y -= 1;
                break;
            case "left":
                players[socket.id].x -= 1;
            break;
            case "right":
                players[socket.id].x += 1;
                break;
        }
        // emit a message to all players about the player that moved
        io.in(players[socket.id].room).emit('playerMoved', players[socket.id]);
    });

    socket.on('click', function (coords) {
        players[socket.id].y = coords.y;
        players[socket.id].x = coords.x;
        // emit a message to all players about the player that moved
        io.in(players[socket.id].room).emit('sendPlayer', players[socket.id]);
    });
      
    socket.on('disconnect', function () {
      console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
    });
});