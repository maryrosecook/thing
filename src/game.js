;(function(exports) {
  exports.Game = function() {
    this.c = new Coquette(this, "canvas", 500, 500, "#000");
    this.drawer = new Drawer(this.c.renderer.getCtx());

    this.physics = new Physics(this, { x: 0, y: 0 });
    var viewCenter = this.c.renderer.getViewCenterPos();

    var self = this;
    self.c.entities.create(Mary, {
      pos: { x:viewCenter.x, y:viewCenter.y }
    }, function(mary) {
      self.mary = mary;

      self.c.entities.create(Isla, {
        pos: { x:viewCenter.x + 20, y:viewCenter.y }
      }, function(isla) {
        self.isla = isla;
        self.director = new Director(self);
      });
    });

    var gridWidthHeight = this.c.renderer.getViewSize().x * 0.8;
    var viewCenterPos = this.c.renderer.getViewCenterPos();
    var viewSize = this.c.renderer.getViewSize();
    this.c.entities.create(Grid, { gridWidthHeight: gridWidthHeight });
    this.c.entities.create(Structure, {
      gridWidthHeight: gridWidthHeight,
      pos: {
        x: viewCenterPos.x - viewSize.x / 2 -
          (viewCenterPos.x % gridWidthHeight) + gridWidthHeight * 2,
        y: viewCenterPos.y - viewSize.y / 2 -
          (viewCenterPos.y % gridWidthHeight) + gridWidthHeight * 2,
      },
      color: "#333"
    });
  };

  exports.Game.prototype = {
    update: function(delta) {
      this.c.renderer.setViewCenterPos(this.mary.pos);
      this.physics.update(delta);
      this.director.update();
    },

    draw: function() {
      this.physics.draw();
    }
  };
})(this);
