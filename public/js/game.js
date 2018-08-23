var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('map', 'assets/map.png')
    this.load.spritesheet('charactor', 'assets/charactor.png', { frameWidth: 48, frameHeight: 48 })
}

function create ()
{
    this.add.image(400, 300, 'map');
    this.player = this.add.sprite(100,100,'charactor');
    cursors = this.input.keyboard.createCursorKeys();
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
    
}

function update ()
{
    if (cursors.left.isDown) // if the left arrow key is down
    {
        this.player.x -= .5; // move left
        this.player.anims.play('walkLeft', false);
    }
    if (cursors.right.isDown) // if the right arrow key is down
    {
        this.player.x += .5; // move left
        this.player.anims.play('walkRight', true);
    }
    if (cursors.up.isDown)
    {
        this.player.y -= .5; // move left        
        this.player.anims.play('walkUp', true);
    }
    if (cursors.down.isDown)
    {
        this.player.y += .5; // move left        
        this.player.anims.play('walkDown', true);
    }
}