;(function(exports) {
  exports.Grid = function(game, gridWidthHeight) {
    this.zindex = -10;
    this.game = game;
    this.gridWidthHeight = gridWidthHeight;
    this.color = "#333";
  };

  exports.Grid.prototype = {
    draw: function() {
      var viewCenter = this.game.c.renderer.getViewCenter();
      var viewSize = this.game.c.renderer.getViewSize();

      var x = viewCenter.x - viewSize.x / 2 - (viewCenter.x % this.gridWidthHeight);
      while (x < viewCenter.x + viewSize.x / 2) {
        this.game.drawer.rect({ x: x, y: viewCenter.y},
                              { x: 1, y: viewSize.y },
                              undefined, this.color);
        x += this.gridWidthHeight;
      }

      var y = viewCenter.y - viewSize.y / 2 - (viewCenter.y % this.gridWidthHeight);
      while (y < viewCenter.y + viewSize.y / 2) {
        this.game.drawer.rect({ x: viewCenter.x, y: y },
                              { x: viewSize.x, y: 1 },
                              undefined, this.color);
        y += this.gridWidthHeight;
      }

      // var center = this.game.drawer.getHome();
      // for (var i = 0; i < 10; i++) {
      //   this.game.drawer.circle(center, i * 230, this.color);
      // }
    }
  };
}(this));
