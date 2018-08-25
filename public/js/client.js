var Client = {};
Client.socket = io('/game');

Client.askNewPlayer = () => {
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
        game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});