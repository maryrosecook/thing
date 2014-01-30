;(function(exports) {
  exports.Grid = function(game, gridWidthHeight) {
    this.zindex = -10;
    this.game = game;
    this.gridWidthHeight = gridWidthHeight;
    this.color = "#333";
  };

  exports.Grid.prototype = {
    draw: function(ctx) {
      var viewCenter = this.game.c.renderer.getViewCenter();
      var viewSize = this.game.c.renderer.getViewSize();
      ctx.lineWidth = 0.3;

      // var x = viewCenter.x - viewSize.x / 2 - (viewCenter.x % this.gridWidthHeight);
      // while (x < viewCenter.x + viewSize.x / 2) {
      //   this.game.drawer.rect({ x: x, y: viewCenter.y},
      //                         { x: 1, y: viewSize.y },
      //                         undefined, this.color);
      //   x += this.gridWidthHeight;
      // }

      // var y = viewCenter.y - viewSize.y / 2 - (viewCenter.y % this.gridWidthHeight);
      // while (y < viewCenter.y + viewSize.y / 2) {
      //   this.game.drawer.rect({ x: viewCenter.x, y: y },
      //                         { x: viewSize.x, y: 1 },
      //                         undefined, this.color);
      //   y += this.gridWidthHeight;
      // }
    }
  };
}(this));
