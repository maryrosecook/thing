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
    for (var y = settings.center.y, iMap = 0;
         iMap < map.length;
         y += settings.gridWidthHeight, iMap++) {
      for (var x = settings.center.x, jMap = 0;
           jMap < map[iMap].length;
           x += settings.gridWidthHeight, jMap++) {
        if (map[iMap][jMap] === 1) {
          this.game.c.entities.create(Square, {
            center: { x: x, y: y },
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
        this.game.drawer.rect(square.center, square.size, this.color, this.color);
      }
    }
  };

  var Square = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = settings.color;
    this.body = this.game.physics.createBody(this, {
      shape: "circle",
      center: settings.center,
      bodyType: Box2D.Dynamics.b2Body.b2_staticBody,
      size: settings.size,
      fixedRotation: true
    });

    andro.augment(this, destroy);
    andro.augment(this, passer, { from: "owner:destroy", to: "exploder:destroy" });
    andro.augment(this, exploder, {
      color: this.color,
      count: 15,
      maxLife: 1000,
      force: 0.00005,
      event: "destroy"
    });
  };

  Square.prototype = {
    update: function(delta) {
      this.body.update();
      andro.eventer(this).emit('owner:update');
    },

    draw: function() {
      this.game.drawer.circle(this.center, this.size.x / 2, undefined, this.color);
    }
  };

  exports.Square = Square;
  exports.Structure = Structure;
})(this);
