;(function(exports) {
  exports.Powerup = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = "#0a0"; //Maths.randomElement(Maths.colors);
    this.body = game.physics.createBody(this, {
      shape: "circle",
      pos: settings.pos,
      size: settings.size,
      bullet: false
    });
    this.setupBehaviours();
  };

  Powerup.prototype = {

  };
})(this);
