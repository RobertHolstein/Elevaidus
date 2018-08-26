import BaseModel from '../utilities/base-model';
import { NEW_PLAYER, ALL_PLAYERS, CHAT, KEY_PRESS, MOVE, STOP, REMOVE } from '../../shared/constants/actions/player';
import { TOWN, HOUSE_1, HOUSE_2 } from '../../shared/constants/scenes';

class Player extends BaseModel {
    static onConnect(io, socket) {
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
    }
}

export default Player;