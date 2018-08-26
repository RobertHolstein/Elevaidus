var path = window.location.pathname;
const room = path.split("/").pop();

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tileset', 'assets/map/tilesheet.png')
    this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    this.load.spritesheet('charactor', 'assets/sprites/charactor.png', { frameWidth: 48, frameHeight: 48 })
}

function create ()
{
    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();

    
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  this.socket.on('playerMoved', (playerInfo) => {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
    });
    if(playerInfo.playerId === self.player.playerId) {
        self.player.setPosition(playerInfo.x, playerInfo.y);    
        self.cameras.main.startFollow(self.player);
    }
  });
  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  this.socket.on('sendPlayer', (playerInfo) =>{
    if(playerInfo.playerId === self.player.playerId) {
        SendPlayer(this,playerInfo.x,playerInfo.y)  
        return
    }
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
            // SendOtherPlayer(this,otherPlayer,,playerInfo.y)  
            var tween = self.tweens.add({
                targets: otherPlayer,
                x: playerInfo.x,
                y: playerInfo.y,
                duration: Phaser.Math.Between(otherPlayer.x,otherPlayer.y,playerInfo.x,playerInfo.y)*8,
            })
            return;
        }
    });
    });

    // ***** MAP *****
    this.map = this.add.tilemap('map');
    var tileset = this.map.addTilesetImage('tilesheet', 'tileset');
    var layer;
    for(var i = 0; i < this.map.layers.length; i++) {
        layer = this.map.createStaticLayer(i, tileset, 0, 0);
    }
    layer.inputEnabled = true;

    cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', (event) =>{
        SendClick(self,event.x,event.y);
    });

    this.anims.create({
        key: 'walkUp',
        frames: this.anims.generateFrameNames('charactor', { frames: [ 2, 6, 10, 14 ] }),
        frameRate: 3,
        repeat: 0
    });
    this.anims.create({
        key: 'walkRight',
        frames: this.anims.generateFrameNames('charactor', { frames: [ 3, 7, 11, 15] }),
        frameRate: 3,
        repeat: 0
    });
    this.anims.create({
        key: 'walkLeft',
        frames: this.anims.generateFrameNames('charactor', { frames: [ 1, 5, 9, 13] }),
        frameRate: 3,
        repeat: 0
    });
    this.anims.create({
        key: 'walkDown',
        frames: this.anims.generateFrameNames('charactor', { frames: [ 4, 8, 12, 16 ] }),
        frameRate: 3,
        repeat: 0
    });
    
    this.socket.on('connect', () => {
        this.socket.emit('join',  room );
    });
}

function update ()
{
    if (cursors.left.isDown) // if the left arrow key is down
    {
        PlayerMovement(this, 'left')
        this.player.anims.play('walkLeft', true);
    }
    if (cursors.right.isDown) // if the right arrow key is down
    {
        PlayerMovement(this,'right');
        this.player.anims.play('walkRight', true);
    }
    if (cursors.up.isDown)
    {
        PlayerMovement(this, 'up');        
        this.player.anims.play('walkUp', true);
    }
    if (cursors.down.isDown)
    {
        PlayerMovement(this, 'down');        
        this.player.anims.play('walkDown', true);
    }
}

function addPlayer(self, playerInfo) {
  self.player = self.add.sprite(playerInfo.x, playerInfo.y, playerInfo.sprite);
  self.player.playerId = playerInfo.playerId;
  self.player.room = playerInfo.room;
}


function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, playerInfo.sprite);
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.room = playerInfo.room;
  self.otherPlayers.add(otherPlayer);
}

function PlayerMovement(self, direction){
    self.socket.emit('playerMovement', direction);
}

function SendClick(self,x,y){
    self.socket.emit('click', {x, y});
}

function SendPlayer(self,x,y){
    var tween = self.tweens.add({
        targets: self.player,
        x: x,
        y: y,
        duration: Phaser.Math.Between(self.player.x,self.player.y,x,y)*8,
    })
}
