var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const PORT = 3001;
var routes = require('./routes')(app, server, express, PORT);

import Player from './models/player';

 var Players;
io.on('connection', function (socket) {
    Player.onConnect(io,socket);
    Players = Player.players;
    socket.on('disconnect', function () {
      console.log('user disconnected');
        // remove this player from our players object
        Player.onDisconnect(io, socket);
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
    });
});