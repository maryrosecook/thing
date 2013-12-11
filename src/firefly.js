;(function(exports) {
  exports.Firefly = function(game, settings) {
    this.game = game;
    this.flock = settings.flock;
    this.collision = settings.collision;
    this.color = settings.color;
    this.size = { x: Firefly.SIZE.x, y: Firefly.SIZE.y };
    this.zindex = 0;
    this.body = game.physics.createBody(this, {
      shape: Firefly.SHAPE,
      center: settings.center,
      size: this.size,
      bullet: false
    });

    this.setupBehaviours();
  };

  Firefly.SIZE = { x: 3, y: 3 };
  Firefly.SHAPE = "circle";

  Firefly.config = {
    health: {
      color: "#f00",
      collision: function(other, type) {
        if (type === "add" && other instanceof Isla) {
          other.receiveDamage(-1, this);
          this.destroy();
        }
      }
    },

    points: {
      color: "#ff0",
      collision: function(other, type) {
        if (type === "add" && other instanceof Isla) {
          other.score(1);
          this.destroy();
        }
      }
    }
  };

  var ACCELERATION = 0.0000003;

  Firefly.prototype = {
    update: function(delta) {
      var vec = flocker.getVector(this, this.flock.members, this.flock.center, ACCELERATION);
      andro.eventer(this).emit('push:go', { vector: vec });
      this.body.drag(0.00001);
      this.body.update();
      andro.eventer(this).emit('owner:update');
    },

    setupBehaviours: function() {
      andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:go" });
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, benignExploder, {
        color: this.color,
        count: 10,
        maxLife: 1000,
        size: { x: 1.5, y: 1.5 },
        force: 0.00005
      });
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.center, this.size.x / 2, undefined, this.color);
    }
  };
})(this);
