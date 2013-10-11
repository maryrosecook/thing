;(function(exports) {
  exports.Isla = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = "#f00";
    this.body = game.physics.createBody(this, {
      shape: "circle",
      pos: settings.pos,
      size: { x: 12, y: 12 }
    });

    andro.augment(this, health, { health: 12 });
    andro.augment(this, destroy);
    andro.augment(this, push);
    andro.augment(this, follow, { acceleration: 0.00002 });

    andro.augment(this, {
      setup: function(owner, eventer) {
        eventer.bind(this, "health:receiveDamage", function() {
          if (owner.getHealth() < 5) {
            owner.destroy();
          } else {
            owner.body.change({
              size: { x: owner.getHealth(), y: owner.getHealth() },
              pos: owner.pos
            });
          }
        });
      }
    });
  };

  exports.Isla.prototype = {
    DRAG_RATIO: 0.0005,

    update: function(delta) {
      this.body.update();
      this.body.drag(this.DRAG_RATIO);
      andro.eventer(this).emit('owner:update');
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.pos, this.size.x / 2, undefined, this.color);
    }
  };
})(this);
