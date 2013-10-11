;(function(exports) {
  exports.Monster = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = "#0a0"; //Maths.randomElement(Maths.colors);
    this.body = game.physics.createBody(this, {
      shape: "circle",
      pos: settings.pos,
      size: settings.size,
      bullet: false
    });

    this.setupBehaviours();
  };

  exports.Monster.prototype = {
    update: function(delta) {
      this.body.update();
      // this.body.drag(0.00001);
      andro.eventer(this).emit('owner:update');
    },

    setupBehaviours: function() {
      andro.augment(this, health, { health: 1 });
      andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:go" });
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, monsterBehaviours.homer, {
        target: this.game.isla,
        acceleration: 0.000002,
        turnSpeed: 0.00025
      });
      andro.augment(this, benignExploder, {
        color: "white",
        count: 10,
        maxLife: 1000,
        size: { x: 1.5, y: 1.5 },
        force: 0.00005
      });
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.pos, this.size.x / 2, undefined, this.color);
    },

    collision: function(other, type) {
      if (type === "add" && other instanceof Isla) {
        other.receiveDamage(1, this);
        this.destroy();
      }
    }
  };

  var monsterBehaviours = {
    homer: {
      setup: function(owner, eventer, settings) {
        eventer.bind(this, 'owner:update', function() {
          var toTargetUnit = Maths.unitVector({
            x: settings.target.pos.x - owner.pos.x,
            y: settings.target.pos.y - owner.pos.y
          });

          eventer.emit('push:go', {
            vector: {
              x: toTargetUnit.x * settings.acceleration,
              y: toTargetUnit.y * settings.acceleration,
            },
            speedLimit: 0.03
          });

          var currentAngle = Maths.vectorToAngle(owner.vec);
          var angleToTarget = Maths.vectorToAngle(toTargetUnit);
          var max = Math.max(currentAngle, angleToTarget);
          var min = Math.min(currentAngle, angleToTarget);
          var error = Math.min(max - min, 360 - max + min) / 180;
          owner.body.drag(error * settings.turnSpeed);
        });
      }
    },

    // dragger
  };

  // mary
    // bumping
    // getting isla to follow
    // using her as bait

  // powerups
    // shoveler

  // isla
    // panicking and getting clingy
    // running off
    // "come on, mary"

  // randomly generated structures made of grid squares

  // radar

  // words coming out in letters that are physics objects

  // talking
  // follow isla and protect her

  // just lines for levels
  // random structures you chase around
  // random bulidings you go into for some reason

  // formations flying in! so cool - three suicides

  // isla squeaks when hit
  // isla gets trapped inside small thing and have to protect her from outside
  // large white bubbles you and isla get trapped in

  // move from safe area to safe area
  // safe areas are sensors that kill monsters when they hit

  // isla stays a bit away if she can

  // delay before respawn to replace killed things

  // advantage of structures - can reduce approach vectors inside structures

  // isla sees things you can't pick up (powerups? health?) and runs off to grab them

  // make drag proportional to isla size (slows her down too much when she gets small)
    // two effects: on slow down speed after shove plus also max speed
    // but still make her get a bit slower as she gets smaller

  // great moments:
    // losing isla
    // her getting small and slow (maybe can recharge her - will make for frantic moment)
})(this);
