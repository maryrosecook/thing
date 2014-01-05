;(function(exports) {
  var MAX_HEALTH = 15;

  exports.Isla = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = "#f00";
    this.points = 0;

    this.body = game.physics.createBody(this, {
      shape: "circle",
      center: settings.center,
      size: { x: MAX_HEALTH, y: MAX_HEALTH },
      density: 0.6
    });

    andro.augment(this, pulse, { rgb: [255, 0, 0], colorsToCycle: [1, 0, 0] });
    andro.augment(this, health, { health: MAX_HEALTH });
    andro.augment(this, destroy);
    andro.augment(this, push);
    andro.augment(this, follow, { acceleration: 0.00003 });
    andro.augment(this, home, {
      acceleration: 0.000020,
      turnSpeed: 0.001
    });

    andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:destroy" });
    andro.augment(this, benignExploder, {
      color: this.color,
      count: 30,
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
          eventer.emit("pulse:stop");
          if (owner.getHealth() <= 6) {
            owner.destroy();
          } else if (owner.getHealth() <= 9) {
            eventer.emit("pulse:start", { speed: 15 });
          } else if (owner.getHealth() < 15) {
            eventer.emit("pulse:start", { speed: 5 });
          }

          owner.body.change({
            size: { x: owner.getHealth(), y: owner.getHealth() },
            center: owner.center
          });
        });
      }
    });

    // targeting - dots or mary
    andro.augment(this, {
      maryRange: this.game.c.renderer.getViewSize().x,

      setup: function(owner, eventer) {
        this.owner = owner;

        // acquire target
        eventer.bind(this, "owner:update", function() {
          owner.target = this.getTarget();
        });

        // move towards target
        eventer.bind(this, "owner:update", function() {
          if (owner.target instanceof Mary) {
            andro.eventer(owner).emit("follow:go", owner.target);
          } else if (owner.target instanceof Dot) {
            andro.eventer(owner).emit("home:go", owner.target);
          }
        });
      },

      getTarget: function() {
        if (this.owner.target instanceof Dot &&
            isAlive(this.owner.target) &&
            Maths.distance(this.owner.center, this.owner.target.center) <
              exports.Isla.FIREFLY_RANGE) {
          return this.owner.target; // keep this firefly as target
        } else if (this.owner.target === undefined ||
                   this.owner.target instanceof Mary) {
          var target = closest(this.owner, game.c.entities.all(Dot));
          if (target !== undefined &&
              Maths.distance(this.owner.center, target.center) <
                exports.Isla.FIREFLY_RANGE) {
            return target;
          }
        }

        if (Maths.distance(this.owner.center, self.game.mary.center) <
              this.maryRange) {
          return self.game.mary;
        }
      }
    });
  };

  exports.Isla.FIREFLY_RANGE = 200;


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
      if (this.game.stateMachine.state === "playing") {
        andro.eventer(this).emit('owner:update');
      }
      // var self = this;
      // snowflake.every(function() {
      //   console.log(self.center.x, self.center.y)
      // }, 1000);
    },

    score: function(points) {
      this.points += points;
    },

    collision: function(other) {
      if (other instanceof Dot) {
        andro.eventer(this).emit("home:stop");
      }
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.center, this.size.x / 2, undefined, this.getColor());
    }
  };
})(this);
