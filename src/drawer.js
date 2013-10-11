;(function(exports) {
  exports.Drawer = function(ctx) {
    this.ctx = ctx;
  };

  exports.Drawer.prototype = {
    circle: function(pos, radius, strokeColor, fillColor) {
      describeCircle(this.ctx, pos, radius);

      if (strokeColor !== undefined) {
        this.ctx.strokeStyle = strokeColor;
        this.ctx.stroke();
      }

      if (fillColor !== undefined) {
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
      }
    },

    point: function(pos, color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(pos.x, pos.y, 1, 1);
    },

    rect: function(pos, size, strokeColor, fillColor) {
      if (strokeColor !== undefined) {
        this.ctx.strokeStyle = strokeColor;
        this.ctx.strokeRect(pos.x, pos.y, size.x, size.y);
      }

      if (fillColor !== undefined) {
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(pos.x, pos.y, size.x, size.y);
      }
    }
  };

  var describeCircle = function(ctx, pos, radius) {
    ctx.beginPath();
    ctx.arc(pos.x + radius, pos.y + radius, radius, 0, Math.PI * 2, true);
    ctx.closePath();
  };
})(this);
