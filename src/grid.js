;(function(exports) {
  exports.Grid = function(game, settings) {
    this.zindex = -10;
    this.game = game;
    this.gridWidthHeight = settings.gridWidthHeight;
    this.color = "#333";
  };

  exports.Grid.prototype = {
    draw: function() {
      var viewCenter = this.game.c.renderer.getViewCenterPos();
      var viewSize = this.game.c.renderer.getViewSize();
      var x = viewCenter.x - viewSize.x / 2 - (viewCenter.x % this.gridWidthHeight);
      while (x < viewCenter.x + viewSize.x / 2) {
        this.game.drawer.rect({ x: x, y: viewCenter.y - viewSize.y / 2},
                              { x: 1, y: viewSize.y },
                              undefined, this.color);
        x += this.gridWidthHeight;
      }

      var y = viewCenter.y - viewSize.y / 2 - (viewCenter.y % this.gridWidthHeight);
      while (y < viewCenter.y + viewSize.y / 2) {
        this.game.drawer.rect({ x: viewCenter.x - viewSize.x / 2, y: y },
                              { x: viewSize.x, y: 1 },
                              undefined, this.color);
        y += this.gridWidthHeight;
      }
    }
  };
}(this));
