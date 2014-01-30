;(function(exports) {
  exports.Scoreboard = function(game, gridWidthHeight) {
    this.zindex = -10;
    this.game = game;
    this.gridWidthHeight = gridWidthHeight;
  };

  exports.Scoreboard.prototype = {
    draw: function(ctx) {
      var viewCenter = this.game.c.renderer.getViewCenter();
      var viewSize = this.game.c.renderer.getViewSize();
      var inset = 10;

      var x = viewCenter.x - viewSize.x / 2 - (viewCenter.x % this.gridWidthHeight)
          + this.gridWidthHeight + inset;
      var y = viewCenter.y - viewSize.y / 2 - (viewCenter.y % this.gridWidthHeight)
          + this.gridWidthHeight + inset;

      ctx.lineWidth = 1;
      this.game.drawer.circle({ x: x + 0, y: y }, Dot.SIZE.x / 2,
                              "#222");
      this.game.drawer.circle({ x: x + Dot.SIZE.x * 2, y: y }, Dot.SIZE.x / 2,
                              "#222");
      this.game.drawer.circle({ x: x + Dot.SIZE.x * 4, y: y }, Dot.SIZE.x / 2,
                              "#222");
      this.game.drawer.circle({ x: x + Dot.SIZE.x * 6, y: y }, Dot.SIZE.x / 2,
                              "#222");
      this.game.drawer.circle({ x: x + Dot.SIZE.x * 8, y: y }, Dot.SIZE.x / 2,
                              "#222");


    }
  };
}(this));
