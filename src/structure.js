;(function(exports) {
  var Structure = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = settings.color;
    this.squares = [];

    var map = [
      [1, 1, 1, 1],
      [0, 0, 0, 1],
      [1, 1, 0, 1],
      [1, 1, 0, 1]
    ];

    var viewSize = this.game.c.renderer.getViewSize();

    var self = this;
    for (var y = settings.pos.y, iMap = 0;
         iMap < map.length;
         y += settings.gridWidthHeight, iMap++) {
      for (var x = settings.pos.x, jMap = 0;
           jMap < map[iMap].length;
           x += settings.gridWidthHeight, jMap++) {
        if (map[iMap][jMap] === 1) {
          this.game.c.entities.create(Square, {
            pos: { x: x, y: y },
            size: { x: settings.gridWidthHeight, y: settings.gridWidthHeight },
            color: "#fff"
          }, function(e) {
            self.squares.push(e);
          });
        }
      }
    }
  };

  Structure.prototype = {
    draw: function(ctx) {
      for (var i = 0; i < this.squares.length; i++) {
        var square = this.squares[i];
        this.game.drawer.rect(square.pos, square.size, this.color, this.color);
      }
    }
  };

  var Square = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = settings.color;
    this.body = this.game.physics.createBody(this, {
      shape: "rectangle",
      pos: settings.pos,
      bodyType: Box2D.Dynamics.b2Body.b2_staticBody,
      size: settings.size
    });
  };

  Square.prototype = {
    update: function(delta) {
      this.body.update();
      andro.eventer(this).emit('owner:update');
    },
  };

  exports.Square = Square;
  exports.Structure = Structure;
})(this);
