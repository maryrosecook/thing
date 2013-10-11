;(function() {
  this.benignExploder = {
    setup: function(owner, eventer, settings) {
      eventer.bind(this, "benignExploder:go", function() {
        for(var i = 0; i < settings.count; i++) {
          owner.game.c.entities.create(Particle, {
            pos: { x: owner.pos.x, y: owner.pos.y },
            size: { x: settings.size.x, y: settings.size.y },
            color: settings.color, density:1, maxLife: settings.maxLife, bullet: false,
            pusher: function() {
              this.body.push({
                x: (Math.random() - 0.5) * settings.force,
                y: (Math.random() - 0.5) * settings.force
              });
            }
          });
        }
      });
    }
  };
}).call(this);
