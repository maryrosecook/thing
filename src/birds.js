;(function(exports) {
  var Dot = exports.Dot = function() {
    this.size = { x: Dot.SIZE.x, y: Dot.SIZE.y };
  };

  Dot.SIZE = { x: 4, y: 4 };

  Dot.prototype = {
    acceleration: 0.0000003,

    update: function(delta) {
      var vec = flocker.getVector(this, this.flock.members, this.flock.center,
                                  this.acceleration, {
                                    orbit: 2, heading: 0.3, separation: 0.3, cohesion: 0.36
                                  });

      andro.eventer(this).emit('push:go', { vector: vec });
      this.body.drag(0.00001);
      this.body.update();
      andro.eventer(this).emit('owner:update');
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.center, this.size.x / 2, undefined, this.color);
    },

    setupBehaviours: function() {
      andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:destroy" });
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, benignExploder, {
        color: this.color,
        count: 10,
        maxLife: 1000,
        force: 0.00005,
        event: "destroy"
      });
    }
  };

  var PointsDot = exports.PointsDot = function(game, settings) {
    this.game = game;
    this.size = Maths.copyPoint(Dot.SIZE);
    this.color = "#ff0";
    this.body = createDotBody(this, settings);
    this.setupBehaviours();
  };

  PointsDot.prototype = new Dot();
  PointsDot.prototype.collision = function(other, type) {
    if (type === "add" && other instanceof Isla) {
      other.score(1);
      this.destroy();
    }
  };

  var HealthDot = exports.HealthDot = function(game, settings) {
    this.game = game;
    this.size = Maths.copyPoint(Dot.SIZE);
    this.color = "#f00";
    this.body = createDotBody(this, settings);
    this.setupBehaviours();
  };

  HealthDot.prototype = new Dot();
  HealthDot.prototype.collision = function(other, type) {
    if (type === "add" && other instanceof Isla) {
      other.receiveDamage(-1, this);
      this.destroy();
    }
  };

  var Stuka = exports.Stuka = function(game, settings) {
    this.game = game;
    this.size = { x: 7, y: 7 };
    this.color = "#fff";
    this.body = game.physics.createBody(this, {
      shape: "triangle",
      center: settings.center,
      size: this.size,
      bullet: false,
      density: 0.4
    });

    this.setupBehaviours();
  };

  exports.Stuka.prototype = {
    acceleration: 0.0000014,

    update: function(delta) {
      if (this.game.stateMachine.state === "playing") {
        this.body.update();
        this.body.rotateTo(Maths.vectorToAngle(this.vec));

        var vec = flocker.getVector(this, this.flock.members, this.game.isla.center,
                                    this.acceleration, {
                                      orbit: 2, heading: 0, separation: 0.5, cohesion: 0
                                    });
        andro.eventer(this).emit('push:go', { vector: vec });
        this.body.drag(0.000015);

        andro.eventer(this).emit('owner:update');
      }
    },

    setupBehaviours: function() {
      andro.augment(this, passer, { from: "owner:destroy", to: "benignExploder:destroy" });
      andro.augment(this, health, { health: 1 });
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, home, {
        acceleration: 0.000002,
        turnSpeed: 0.00025
      });

      andro.augment(this, benignExploder, {
        color: this.color,
        count: 15,
        maxLife: 1000,
        size: { x: 1.5, y: 1.5 },
        force: 0.00005,
        event: "destroy"
      });
    },

    draw: function(ctx) {
      this.game.drawer.triangle(this.center, this.size.x, undefined, this.color);
    },

    collision: function(other, type) {
      if (type === "add" && other instanceof Isla) {
        other.receiveDamage(3, this);
        this.destroy();
      } else if (type === "add" && other instanceof Stuka) {
        this.destroy();
      }
    }
  };

  var createDotBody = function(entity, settings) {
    return game.physics.createBody(entity, {
      shape: "circle",
      center: settings.center,
      size: entity.size,
      bullet: false,
      vec: { x: Math.random() / 100 - 0.005, y: Math.random() / 100 - 0.005 }
    });
  };
})(this);
