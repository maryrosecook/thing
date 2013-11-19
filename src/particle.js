;(function(exports) {
  exports.Particle = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.body = game.physics.createBody(this, {
      shape: "circle",
      center: settings.center,
      size: settings.size,
      bullet: settings.bullet || false,
      restitution: settings.restitution || 0.5,
      density: settings.density || 1,
    });

    this.maxLife = settings.maxLife;
    this.dangerous = settings.dangerous || false;
    this.color = settings.color;

    this.birth = new Date().getTime();
    this.setupDestroy();

    settings.pusher.call(this);
    andro.augment(this, destroy);
  };

  exports.Particle.prototype = {
    update: function() {
      this.body.update();
    },

    setupDestroy: function() {
      var self = this;
      this.destroyTimeout = setTimeout(function() {
        self.destroy();
      }, this.maxLife * Math.random());
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.center, this.size.x / 2, undefined, this.color);
    }
  };
})(this);
