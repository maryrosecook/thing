;(function(exports) {
  var Dot = exports.Dot = function() {
    this.size = { x: Dot.SIZE.x, y: Dot.SIZE.y };
  };

  Dot.SIZE = { x: 6, y: 6 };

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
      andro.augment(this, passer, { from: "owner:destroy", to: "exploder:destroy" });
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, exploder, {
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

  var Stuka = exports.Stuka = function(game, settings) {};

  Stuka.prototype = {
    color: "#fff",

    update: function(delta) {
      if (this.game.stateMachine.state === "playing") {
        this.body.update();
        this.body.rotateTo(Maths.vectorToAngle(this.vec));

        var vec = flocker.getVector(this, this.flock.members, this.game.isla.center,
                                    this.acceleration, {
                                      orbit: 2, heading: 0, separation: 0.5, cohesion: 0.1
                                    });
        andro.eventer(this).emit('push:go', { vector: vec });
        this.body.drag(0.000015);

        andro.eventer(this).emit('owner:update');
      }
    },

    setupBehaviours: function(startHealth) {
      andro.augment(this, passer, { from: "owner:destroy", to: "exploder:destroy" });
      andro.augment(this, health, { health: startHealth });
      andro.augment(this, push);
      andro.augment(this, destroy);

      andro.augment(this, exploder, {
        color: this.color,
        count: 15,
        maxLife: 1000,
        force: 0.00005,
        event: "destroy"
      });
    },

    draw: function(ctx) {
      this.game.drawer.triangle(this.center, this.size.x, this.color);
    },

    collision: function(other, type) {
      if (type === "add" && other instanceof Isla) {
        other.receiveDamage(3, this);
        this.destroy();
      } else if (type === "add" &&
                 (other instanceof Stuka || other instanceof Explosive)) {
        this.destroy();
      }
    }
  };

  var SmallStuka = exports.SmallStuka = function(game, settings) {
    this.game = game;
    this.acceleration = 0.0000014;
    this.size = { x: 9, y: 9 };
    this.body = createStukaBody(this, utils.mixin(settings, { density: 0.35 }));
    this.setupBehaviours(1);
  };

  SmallStuka.prototype = new Stuka();

  var createStukaBody = function(entity, settings) {
    return game.physics.createBody(entity, {
      shape: "triangle",
      center: settings.center,
      size: entity.size,
      bullet: false,
      density: settings.density
    });
  };

  var createDotBody = function(entity, settings) {
    return game.physics.createBody(entity, {
      shape: "circle",
      center: settings.center,
      size: entity.size,
      bullet: false,
      density: 0.35,
      vec: { x: Math.random() / 100 - 0.005, y: Math.random() / 100 - 0.005 }
    });
  };

  var Explosive = exports.Explosive = function(game, settings) {
    this.game = game;
    this.size = { x: 9, y: 9 };
    this.color = "#44f";
    this.stateMachine = new StateMachine({
      "": ["homing"],
      "homing": ["ticking"],
      "ticking": ["firing"]
    });

    this.stateMachine.transition("homing");

    this.body = game.physics.createBody(this, {
      shape: "triangle",
      center: settings.center,
      size: this.size,
      bullet: true,
      density: 0.35
    });

    this.setupBehaviours(game);
  };

  Explosive.prototype = {
    homing: function() {
      var vec = flocker.getVector(this, [], game.isla.center, 0.0000014, {
        orbit: 2, heading: 0, separation: 0, cohesion: 0
      });

      andro.eventer(this).emit('push:go', { vector: vec });
      this.body.rotateTo(Maths.vectorToAngle(this.vec));

      if (Maths.distance(this.center, game.isla.center) < 100) {
        this.body.SetFixedRotation(true);
        this.stateMachine.transition("ticking");
        andro.eventer(this).emit("pulse:start", { speed: 15 });
        this.timer = new Date().getTime();
      }
    },

    ticking: function() {
      this.body.drag(0.0004);
      this.body.rotateTo(Maths.vectorToAngle(Maths.vectorTo(this.center, this.game.isla.center)));
      if (this.timer + 2000 < new Date().getTime()) {
        this.stateMachine.transition("firing");
        this.timer = new Date().getTime();

        var vec = Maths.unitVector(Maths.vectorTo(this.center, this.game.isla.center));
        this.body.push(Maths.vectorMultiply(vec, 0.0008));
      }
    },

    firing: function() {
      if (this.timer + 500 < new Date().getTime()) {
        this.destroy();
      }
    },

    update: function(delta) {
      if (this.game.stateMachine.state === "playing") {
        this.body.update();
        this[this.stateMachine.state](delta);
        andro.eventer(this).emit('owner:update');
      }
    },

    collision: function(other, type) {
      if (type === "add" && other instanceof Isla) {
        other.receiveDamage(3, this);
        this.destroy();
      } else if (type === "add" && (other instanceof Stuka || other instanceof Mary)) {
        this.destroy();
      }
    },

    setupBehaviours: function(game) {
      andro.augment(this, push);
      andro.augment(this, destroy);
      andro.augment(this, pulse, { rgb: [60, 60, 255], colorsToCycle: [1, 1, 1], minBrightness: 90 });
      andro.augment(this, passer, { from: "owner:destroy", to: "exploder:destroy" });

      andro.augment(this, exploder, {
        color: this.color,
        count: 15,
        maxLife: 1000,
        force: 0.00005,
        event: "destroy"
      });
    },

    draw: function(ctx) {
      this.game.drawer.triangle(this.center, this.size.x, this.getCurrentColor());
    }
  };

})(this);
