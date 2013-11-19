;(function(exports) {
  exports.Isla = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = "#f00";
    this.body = game.physics.createBody(this, {
      shape: "circle",
      center: settings.center,
      size: { x: 12, y: 12 }
    });

    andro.augment(this, health, { health: 12 });
    andro.augment(this, destroy);
    andro.augment(this, push);
    andro.augment(this, follow, { acceleration: 0.00002 });
    andro.augment(this, home, {
      acceleration: 0.000020,
      turnSpeed: 0.001
    });

    andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:go" });
    andro.augment(this, benignExploder, {
      color: this.color,
      count: 10,
      maxLife: 1000,
      size: { x: 1.5, y: 1.5 },
      force: 0.00005,
      event: "destroy"
    });

    andro.augment(this, passer, { from: "health:receiveDamage", to: "benignExploder:damage" });
    andro.augment(this, benignExploder, {
      color: this.color,
      count: 3,
      maxLife: 1000,
      size: { x: 1.5, y: 1.5 },
      force: 0.00005,
      event: "damage"
    });

    andro.augment(this, {
      setup: function(owner, eventer) {
        eventer.bind(this, "health:receiveDamage", function() {
          if (owner.getHealth() < 5) {
            owner.destroy();
          } else {
            owner.body.change({
              size: { x: owner.getHealth(), y: owner.getHealth() },
              center: owner.center
            });
          }
        });
      }
    });

    // chase fireflies
    andro.augment(this, "owner:update", function(__, owner, eventer) {
      if (owner.getTarget() === undefined || !isAlive(owner.getTarget())) {
        var target = closest(owner, game.c.entities.all(Firefly));
        if (target !== undefined) {
          eventer.emit("home:go", target);
        }
      }
    });
  };

  var closest = function(entity, entities) {
    return entities.sort(function(a, b) {
      return Maths.distance(a.center, entity.center) - Maths.distance(b.center, entity.center);
    })[0];
  };

  var isAlive = function(entity) {
    var all = game.c.entities.all();
    for (var i = 0, len = all.length; i < len; i++) {
      if (all[i] === entity) {
        return true;
      }
    }
    return false;
  };

  exports.Isla.prototype = {
    DRAG_RATIO: 0.0005,

    update: function(delta) {
      this.body.update();
      this.body.drag(this.DRAG_RATIO);
      andro.eventer(this).emit('owner:update');
    },

    collision: function(other) {
      if (other instanceof Firefly) {
        andro.eventer(this).emit("home:stop");
      } else if (other instanceof Monster) {

      }
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.center, this.size.x / 2, undefined, this.color);
    }
  };
})(this);
