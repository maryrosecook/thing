;(function(exports) {
  var BuildQueue = function() {
    var queue = [];

    this.add = function(createFn, delay, fn) {
      var order = {
        type: createFn,
        time: new Date().getTime() + delay,
        run: function() {
          fn(createFn);
          this.clear();
        },

        clear: function() {
          queue.splice(queue.indexOf(this), 1);
        }
      };

      queue.push(order);
    };

    this.all = function() {
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

  Director.MIN_DOT_SPAWN_DISTANCE = 1500;
  Director.MIN_STUKA_SPAWN_DISTANCE = 800;

  Director.prototype = {
    isStageInProgress: true,

    update: function(__) {
      var self = this;

      if (this.isStageInProgress && this.flockCount(Stuka) < 1) {
        this.buildQueue.add(Stuka, delay=1000, function(createFn) {
          createFlock(self.game, createFn, {
            center: Maths.surroundingSpawnPoint(game.isla.center,
                                                Director.MIN_STUKA_SPAWN_DISTANCE),
            count: self.stage
          });
        });
      }

      if (this.stage > 3 && this.flockCount(HealthDot) < 1) {
        this.buildQueue.add(HealthDot, delay=5000, function(createFn) {
          createFlock(self.game, createFn, {
            center: Maths.surroundingSpawnPoint(game.isla.center,
                                                Director.MIN_DOT_SPAWN_DISTANCE),
            count: 5
          });
        });
      }

      if (this.flockCount(PointsDot) < 1) {
        this.isStageInProgress = false;
        this.buildQueue.add(PointsDot, delay=3000, function(createFn) {
          self.isStageInProgress = true;
          self.stage++;
          createFlock(self.game, createFn, {
            center: Maths.surroundingSpawnPoint(game.isla.center,
                                                Director.MIN_DOT_SPAWN_DISTANCE),
            count: self.stage
          });
        });
      }

      this.buildQueue.update();
    },

    start: function() {
      createFlock(this.game, PointsDot, {
        minDistance: 100,
        count: this.stage,
        center: {
          x: this.game.drawer.getHome().x - 102,
          y: this.game.drawer.getHome().y + 102
        }
      });
    },

    reset: function() {
      this.stage = 1;
      this.buildQueue.clear();
    },

    destroyAll: function() {
      _.invoke(this.game.c.entities.all(Dot), "destroy");
      _.invoke(this.game.c.entities.all(Stuka), "destroy");
    },

    flockCount: function(createFn) {
      return _.filter(this.game.c.entities.all(Flock), function(x) {
        return x.members.length > 0 && x.members[0] instanceof createFn;
      }).length +
      _.filter(this.buildQueue.all(), function(x) {
        return x.type === createFn;
      }).length;
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

  var createFlock = function(game, createBirdFn, flockSettings) {
    game.c.runner.add(undefined, function() { // next tick so sure not creating during col det
      var flock = game.c.entities.create(Flock, flockSettings);
      _.times(flockSettings.count, function() {
        var bird = game.c.entities.create(createBirdFn, { center: flock.center });
        while (!game.physics.freeSpace(bird)) {
          bird.body.move(Maths.surroundingSpawnPoint(flock.center, 100));
        }

        flock.add(bird);
      });
    });
  };

  exports.Director = Director;
}(this));
