;(function(exports) {
  exports.Flock = function(game, settings) {
    this.game = game;
    this.center = settings.center;
    this.size = { x: Flock.SIZE.x, y: Flock.SIZE.y };
    this.type = settings.fireflyType;

    var deadMembers = 0;

    this.members = [];
    var self = this;
    _.times(settings.fireflyCount, function() {
      var center = memberCenter(Firefly, self.game, self, 100);
      game.c.entities.create(Firefly, {
        center: center,
        flock: self,
        collision: Firefly.config[self.type].collision,
        color: Firefly.config[self.type].color
      }, function(member) {
        andro.eventer(member).bind(this, "owner:destroy", function() {
          if (++deadMembers === settings.fireflyCount) {
            self.destroy();
          }
        });

        self.members.push(member);
      });
    });
  };

  Flock.SIZE = { x: 20, y: 20 };
  Flock.SHAPE = "circle";

  Flock.prototype = {
    update: function(delta) {
      andro.eventer(this).emit('owner:update');
    },

    // draw: function(ctx) {
    //   this.game.drawer.circle(this.pos, this.size.x / 2, undefined, "#fff");
    // },

    destroy: function() {
      _.invoke(this.members, "destroy");
      this.game.c.entities.destroy(this);
    }
  };

  var memberCenter = function(Constructor, game, centerObj, minDistance) {
    var dummy = Director.dummyEntity(Constructor,
                                     Maths.surroundingSpawnPoint(centerObj.center,
                                                                 minDistance));
    return game.physics.freeSpace(dummy) ? dummy.center : memberCenter.apply(null, arguments);
  };
})(this);
