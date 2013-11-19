;(function(exports) {
  exports.Monster = function(game, settings) {
    this.game = game;
    this.size = { x: Monster.SIZE.x, y: Monster.SIZE.y };
    this.zindex = 0;
    this.color = "#0f0";
    this.body = game.physics.createBody(this, {
      shape: Monster.SHAPE,
      center: settings.center,
      size: this.size,
      bullet: false,
      density: 0.4
    });

    this.setupBehaviours();
  };

  Monster.SIZE = { x: 7, y: 7 };
  Monster.SHAPE = "triangle";

  exports.Monster.prototype = {
    update: function(delta) {
      this.body.update();
      this.body.rotateTo(Maths.vectorToAngle(this.vec));
      andro.eventer(this).emit('owner:update');
    },

    setupBehaviours: function() {
      andro.augment(this, health, { health: 1 });
      andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:go" });
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, home, {
        acceleration: 0.000002,
        turnSpeed: 0.00025
      });

      andro.augment(this, benignExploder, {
        color: this.color,
        count: 10,
        maxLife: 1000,
        size: { x: 1.5, y: 1.5 },
        force: 0.00005
      });

      // general behaviour: home in on Isla
      andro.eventer(this).emit("home:go", this.game.isla);
    },

    draw: function(ctx) {
      this.game.drawer.triangle(this.center, this.size.x, undefined, this.color);
    },

    collision: function(other, type) {
      if (type === "add" && other instanceof Isla) {
        other.receiveDamage(1, this);
        this.destroy();
      }
    }
  };

  // mary
    // bumping
    // getting isla to follow ("isla")
    // using her as bait

  // isla
    // panicking and getting clingy
    // running off to collect stars and ignoring your calls ("what?" "mmmmm?")
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
     // try doing this by flocking behaviour
     // try doing this by just moving a target around which the formation members orbit

  // isla squeaks when hit
  // isla gets trapped inside small thing and have to protect her from outside
  // large white bubbles you and isla get trapped in

  // move from safe area to safe area
  // safe areas are sensors that kill monsters when they hit

  // delay before respawn to replace killed things

  // advantage of structures - can reduce approach vectors inside structures

  // isla sees things you can't pick up (powerups? health?) and runs off to grab them

  // make drag proportional to isla size (slows her down too much when she gets small)
    // two effects: on slow down speed after shove plus also max speed
    // but still make her get a bit slower as she gets smaller

  // great moments:
    // losing isla (she runs off after a firefly?)
    // her getting small and slow (maybe can recharge her - will make for frantic moment)

  // make fireflies (and thus Isla) more predictable
  // make monsters slower moving but require multiple hits
  // add death and restart game
  // make monster spawning random
  // somehow make it so the chaos period is harder than the non-chaos

  // shouts are actually bubbles that bounce off if ignored or get absorbed if heeded

  // monsters that need several hits to die (bigger and need to be really rammed to push them away)

  // only draw onscreen entities

  // make camera follow lazily like bomberman
})(this);
