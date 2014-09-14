var Enemy = function (index, game, player, bmd) {
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.alive = true;

    this.sprite = game.add.sprite(x, y, bmd);
    this.sprite.anchor.set(0.5);

    this.sprite.name = index.toString();
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(1, 1);

    this.sprite.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.sprite.rotation, 150, this.sprite.body.velocity);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.update = function(enemies) {
    var neighbourCount = 0;
    // Alignment
    var alignVel = new Phaser.Point();
    var cohesionVel = new Phaser.Point();
    var seperationVel = new Phaser.Point();
    alignVel.copyFrom(this.sprite.body.velocity);
    if (enemies) {
        for (var i = enemies.length - 1; i >= 0; i--) {
            if(enemies[i] != this && this.game.physics.arcade.distanceBetween(this.sprite.body, enemies[i].sprite.body) < 150) {
                // Average Velocity of Group
                alignVel.add(enemies[i].sprite.body.velocity.x,enemies[i].sprite.body.velocity.y);
                // Center of Mass of Group
                cohesionVel.add(enemies[i].sprite.body.position.x,enemies[i].sprite.body.position.y)
                seperationVel.add(enemies[i].sprite.body.position.x-this.sprite.body.position.x,enemies[i].sprite.body.position.y-this.sprite.body.position.y)
                neighbourCount += 1;
            }
        };
        if (neighbourCount > 0) {
            alignVel = Phaser.Point.normalize(alignVel);
            alignVel.multiply(150,150);
            cohesionVel.multiply(1/neighbourCount,1/neighbourCount);
            cohesionVel.set(cohesionVel.x - this.sprite.body.position.x,cohesionVel.y - this.sprite.body.position.y);
            cohesionVel = Phaser.Point.normalize(cohesionVel);
            cohesionVel.multiply(150,150);
            seperationVel.multiply(1/neighbourCount,1/neighbourCount);
            seperationVel.multiply(-1,-1);
            seperationVel = Phaser.Point.normalize(seperationVel);
            seperationVel.multiply(150,150);
        }
        this.sprite.body.velocity.set(0.2*alignVel.x+0.2*cohesionVel.x+0.25*seperationVel.x,0.2*alignVel.y+0.2*cohesionVel.y+0.25*seperationVel.y);
        this.sprite.body.velocity = Phaser.Point.normalize(this.sprite.body.velocity);
        this.sprite.body.velocity.multiply(150,150);
    }
};

module.exports = Enemy;
