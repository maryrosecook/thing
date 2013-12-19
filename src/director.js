;(function(exports) {
  var BuildQueue = function() {
    var queue = [];

    this.add = function(type, delay, fn) {
      var order = {
        type: type,
        time: new Date().getTime() + delay,
        run: function() {
          fn(type);
          this.clear();
        },

        clear: function() {
          queue.splice(queue.indexOf(this), 1);
        }
      };

      queue.push(order);
    };

    this.all = function(type) {
      return queue.concat();
    };

    this.clear = function() {
      queue = [];
    };

    this.update = function() {
      if (queue[0] !== undefined) { // do one build at a time so can splice safely
        if (new Date().getTime() > queue[0].time) {
          queue[0].run();
        }
      }
    };
  };

  var Director = function(game) {
    this.game = game;
    this.buildQueue = new BuildQueue();
    this.stage = 1;
  };

  Director.MIN_FLOCK_SPAWN_DISTANCE = 1500;

  Director.dummyEntity = function(Constructor, center) {
    return { center: center, size: Constructor.SIZE, shape: Constructor.SHAPE };
  };

  Director.prototype = {
    update: function(__) {
      var self = this;

      if (this.game.c.entities.all(Monster).length +
          this.buildQueue.all(Monster).length < Math.ceil(self.stage / 2)) {
        this.buildQueue.add(Monster, 1000, function() {
          createMonster(self.game, self.game.isla.center, 600);
        });
      }

      if (this.stage > 3 && this.flockCount("health") < 1) {
        this.createHealthFlock(2000, Director.MIN_FLOCK_SPAWN_DISTANCE);
      }

      if (this.flockCount("points") < 1) {
        this.buildQueue.add("points", delay=2000, function(type) {
          self.stage++;
          createFlock(self.game, self.game.mary.center,
                      Director.MIN_FLOCK_SPAWN_DISTANCE, fireflies=self.stage, type);
        });
      }

      this.buildQueue.update();
    },

    start: function() {
      game.c.entities.create(Flock, {
        center: {
          x: game.drawer.getHome().x - 72,
          y: game.drawer.getHome().y + 72
        }, fireflyCount: 1, fireflyType: "points"
      });
    },

    reset: function() {
      this.stage = 1;
      this.buildQueue.clear();
    },

    destroyAll: function() {
      _.invoke(this.game.c.entities.all(Flock), "destroy");
      _.invoke(this.game.c.entities.all(Monster), "destroy");
    },

    flockCount: function(type) {
      return filterType(this.game.c.entities.all(Flock), type).length +
        filterType(this.buildQueue.all(), type).length;
    },

    createHealthFlock: function(delay, distance) {
      this.buildQueue.add("health", delay, function(type) {
        createFlock(self.game, self.game.mary.center, distance, fireflies=10, type);
      });
    }
  };

  // var isIslaNearPointsFirefly = function(isla, entities) {
  //   var flocks = entities.all(Flock);
  //   for (var i = 0; i < flocks.length; i++) {
  //     if (flocks[i].type === "points") {
  //       for (var j = 0; j < flocks[i].members.length; j++) {
  //         if (Maths.distance(isla.center, flocks[i].members[j].center) < Isla.FIREFLY_RANGE) {
  //           return true;
  //         }
  //       }
  //     }
  //   }

  //   return false;
  // };

  var filterType = function(items, type) {
    return _.filter(items, function(x) { return x.type === type; });
  };

  var createFlock = function(game, center, minDistance, fireflyCount, fireflyType) {
    var dummy = Director.dummyEntity(Flock,
                                     Maths.surroundingSpawnPoint(center, minDistance));
    if (game.physics.freeSpace(dummy)) {
      game.c.entities.create(Flock, {
        center: dummy.center, fireflyCount: fireflyCount, fireflyType: fireflyType
      });
    } else {
      createFlock.apply(null, arguments);
    }
  };

  var createMonster = function(game, center, minDistance) {
    var dummy = Director.dummyEntity(Monster,
                                     Maths.surroundingSpawnPoint(center, minDistance));
    if (!game.c.renderer.onScreen(dummy) &&
        game.physics.freeSpace(dummy)
        // raytracer.visible(game.isla, dummy, game.c.entities.all(Square))
       ) {
      game.c.entities.create(Monster, { center: dummy.center });
    } else {
      createMonster.apply(null, arguments);
    }
  };

  exports.Director = Director;
}(this));
