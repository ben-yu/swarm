var Player = require('../entities/player');
var Enemy = require('../entities/enemy');

var Game = function () {
  this.testentity = null;
};

module.exports = Game;

Game.prototype = {

  create: function () {
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2) - 50;

    // Create BitmapData
    this.enemy_bmd = this.game.add.bitmapData(100,100);

    // Draw circle
    this.enemy_bmd.ctx.fillStyle = '#000000';
    this.enemy_bmd.ctx.shadowColor = '#00ff00';
    this.enemy_bmd.ctx.shadowBlur = 40;
    this.enemy_bmd.ctx.shadowOffsetX = 0;
    this.enemy_bmd.ctx.shadowOffsetY = 0;
    this.enemy_bmd.ctx.beginPath();
    this.enemy_bmd.ctx.arc(50, 50, 10, 0, Math.PI*2, true); 
    this.enemy_bmd.ctx.closePath();
    this.enemy_bmd.ctx.fill();

    this.testentity = new Player(this.game, x, y);
    this.testentity.anchor.setTo(0.5, 0.5);

    //  Create some enemies
    this.enemies = [];

    this.enemiesTotal = 20;
    this.enemiesAlive = 20;

    for (var i = 0; i < this.enemiesTotal; i++)
    {
        this.enemies.push(new Enemy(i, this.game, this.testentity, this.enemy_bmd));
    }

    this.input.onDown.add(this.onInputDown, this);
  },

  update: function () {
    var x, y, cx, cy, dx, dy, angle, scale;

    x = this.input.position.x;
    y = this.input.position.y;
    cx = this.world.centerX;
    cy = this.world.centerY;

    angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
    this.testentity.angle = angle;

    dx = x - cx;
    dy = y - cy;
    scale = Math.sqrt(dx * dx + dy * dy) / 100;

    this.testentity.scale.x = scale * 0.6;
    this.testentity.scale.y = scale * 0.6;

    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].alive)
        {
           this.enemies[i].update(this.enemies);
        }
    }

  },

  onInputDown: function () {
    this.game.state.start('Menu');
  }
};
