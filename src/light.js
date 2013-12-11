;(function(exports) {
  exports.Light = function(game, settings) {
    this.game = game;
    this.center = settings.center;
    this.size = { x: Light.SIZE.x, y: Light.SIZE.y };

    this.fireflies = [];
    var self = this;
    _.times(3, function() {
      var center = fireflyCenter(self.game, self, 100);
      game.c.entities.create(Firefly, { center: center, target: self }, function(firefly) {
        self.fireflies.push(firefly);
      });
    });
  };

  var NUM_FIREFLIES = 3;
  Light.SIZE = { x: 20, y: 20 };
  Light.SHAPE = "circle";

  Light.prototype = {
    update: function(delta) {
      andro.eventer(this).emit('owner:update');
    },

    // draw: function(ctx) {
    //   this.game.drawer.circle(this.pos, this.size.x / 2, undefined, "#fff");
    // },

    destroy: function() {
      _.invoke(this.fireflies, "destroy");
    }
  };

  var fireflyCenter = function(game, centerObj, minDistance) {
    var dummy = Director.dummyEntity(Firefly,
                                     Maths.surroundingSpawnPoint(centerObj.center,
                                                                 minDistance));
    return game.physics.freeSpace(dummy) ? dummy.center : fireflyCenter.apply(null, arguments);
  };
})(this);
