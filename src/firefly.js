;(function(exports) {
  exports.Firefly = function(game, settings) {
    this.game = game;
    this.size = { x: Firefly.SIZE.x, y: Firefly.SIZE.y };
    this.zindex = 0;
    this.color = "#ff0";
    this.body = game.physics.createBody(this, {
      shape: Firefly.SHAPE,
      pos: settings.pos,
      size: this.size,
      bullet: false
    });

    this.setupBehaviours(settings.target);
  };

  Firefly.SIZE = { x: 3, y: 3 };
  Firefly.SHAPE = "circle";

  Firefly.prototype = {
    update: function(delta) {
      this.body.update();
      andro.eventer(this).emit('owner:update');
    },

    setupBehaviours: function(target) {
      andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:go" });
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, home, {
        acceleration: 0.000001 + 0.000001 * Math.random(),
        turnSpeed: 0
      });

      andro.augment(this, benignExploder, {
        color: this.color,
        count: 10,
        maxLife: 1000,
        size: { x: 1.5, y: 1.5 },
        force: 0.00005
      });

      andro.eventer(this).emit("home:go", target);
    },

    collision: function(other, type) {
      if (type === "add" && other instanceof Isla) {
        other.receiveDamage(-1, this);
        this.destroy();
      }
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.pos, this.size.x / 2, undefined, this.color);
    }
  };
})(this);
