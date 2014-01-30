var ParticleGhost = function(game, settings) {
  this.center = settings.particle.center;
  this.size = game.particleGhostSize;
  this.color = settings.particle.color;
};

ParticleGhost.prototype = {
  draw: function() {
    game.drawer.circle(this.center, this.size.x / 2, undefined, this.color);
  }
};
