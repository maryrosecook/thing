;(function(exports) {
  exports.Line = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = "#fff";
    this.body = game.physics.createBody(this, {
      shape: "rectangle",
      pos: settings.pos,
      size: settings.size,
      restitution: 0.5,
      density: 10000000000
    });
  };

  Line.create = function(game, x, y, w, h) {
    game.c.entities.create(Line, {
      pos: { x: x, y: y },
      size: { x: w, y: h }
    });
  };

  exports.Line.prototype = {
    update: function(delta) {
      this.body.update();
    },

    draw: function(ctx) {
      this.game.drawer.rect(this.pos, this.size, undefined, this.color);
    }
  };
})(this);
