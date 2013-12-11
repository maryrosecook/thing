;(function(exports) {
  var BuildQueue = function() {
    var queue = [];

    this.add = function(type, delay, fn) {
      var order = {
        type: type,
        time: new Date().getTime() + delay,
        run: function() {
          fn();
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

    this.update = function() {
      _.forEach(queue, function(x) {
        if (new Date().getTime() > x.time) {
          x.run();
        }
      });
    };
  };

  exports.Director = function(game) {
    this.game = game;
    this.buildQueue = new BuildQueue();
  };

  exports.Director.dummyEntity = function(Constructor, center) {
    return { center: center, size: Constructor.SIZE, shape: Constructor.SHAPE };
  };

  exports.Director.prototype = {
    update: function(__) {
      var self = this;

      if (this.game.c.entities.all(Monster).length +
          this.buildQueue.all(Monster).length < 2) {
        this.buildQueue.add(Monster, 2000, function() {
          createMonster(self.game, self.game.isla.center, 600);
        });
      }

      var existingFlocks = this.game.c.entities.all(Flock);

      createBuildOrder(existingFlocks, this.buildQueue, "health", 0, 1, function() {
        createFlock(self.game, self.game.mary.center, 1500, 10, "health");
      });

      createBuildOrder(existingFlocks, this.buildQueue, "points", 0, 1, function() {
        createFlock(self.game, self.game.mary.center, 1500, 10, "points");
      });

      this.buildQueue.update();
    },

    reset: function() {
      destroyAll(this.game.c.entities.all(Flock));
      destroyAll(this.game.c.entities.all(Monster));
    }
  };

  var filterType = function(items, type) {
    return _.filter(items, function(x) { return x.type === type; });
  };

  var destroyAll = function(entities) {
    for (var i = 0; i < entities.length; i++) {
      entities[i].destroy();
    }
  };

  var createBuildOrder = function(existingEntities, buildQueue, type, delay, limit, createFn) {
    if (filterType(existingEntities, type).length +
        filterType(buildQueue.all(), type).length < limit) {
      buildQueue.add(type, delay, createFn);
    }
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
}(this));
