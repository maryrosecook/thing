;(function() {
  this.follow = {
    setup: function(owner, eventer, settings) {
      this.owner = owner;
      eventer.bind(this, 'owner:update', function() {
        if (this.haveTarget()) {
          var toTargetUnit = Maths.unitVector({
            x: owner.target.pos.x - owner.pos.x,
            y: owner.target.pos.y - owner.pos.y
          });

          var minimumPossibleDistance = owner.size.x / 2 + owner.target.size.x / 2 + 3;
          var distance = Maths.distance(owner.pos, owner.target.pos);
          var startSlowing = 100;
          var fullStop = 50;


          owner.body.drag(0.00002);

          var acceleration;
          if (distance > startSlowing) {
            acceleration = settings.acceleration;
          } else if (distance > fullStop) {
            acceleration = (distance - fullStop) / (startSlowing - fullStop) * settings.acceleration;
          } else {
            acceleration = 0;
          }

          eventer.emit('push:go', {
            vector: pull(toTargetUnit, owner.body.mass(), acceleration)
          });

          if (distance > 150) {
            andro.eventer(owner.target).emit('push:go', {
              vector: pull({
                x: -toTargetUnit.x,
                y: -toTargetUnit.y
              }, owner.target.body.mass(), settings.acceleration * 0.5)
            });
          }
        }
      });

      return {
        follow: function(target) {
          if (target === owner.target) {
            owner.target = undefined;
          } else {
            owner.target = target;
          }
        }
      };
    },

    haveTarget: function() {
      return this.owner.target !== undefined;
    }
  };

  var pull = function(direction, acceleration, mass) {
    return {
      x: direction.x * mass * acceleration,
      y: direction.y * mass * acceleration
    };
  };

}).call(this);
