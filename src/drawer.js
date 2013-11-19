;(function(exports) {
  exports.Drawer = function(ctx) {
    this.ctx = ctx;
  };

  exports.Drawer.prototype = {
    circle: function(center, radius, strokeColor, fillColor) {
      describeCircle(this.ctx, center, radius);

      if (strokeColor !== undefined) {
        this.ctx.strokeStyle = strokeColor;
        this.ctx.stroke();
      }

      if (fillColor !== undefined) {
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
      }
    },

    triangle: function(center, width, strokeColor, fillColor) {
      var h = width * Math.sqrt(3)/2;

      this.ctx.beginPath();
      this.ctx.moveTo(center.x - width / 2, center.y + h / 2); // bottom left
      this.ctx.lineTo(center.x, center.y - h / 2); // top
      this.ctx.lineTo(center.x + width / 2, center.y + h / 2); // bottom right
      this.ctx.lineTo(center.x - width / 2, center.y + h / 2); // bottom left
      this.ctx.closePath();

      if (strokeColor !== undefined) {
        this.ctx.strokeColor = strokeColor;
        this.ctx.stroke();
      }

      if (fillColor !== undefined) {
        this.ctx.fillStyle = fillColor;
        this.ctx.lineWidth = 1;
        this.ctx.fill();
      }
    },

    point: function(center, color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(center.x, center.y, 1, 1);
    },

    rect: function(center, size, strokeColor, fillColor) {
      if (strokeColor !== undefined) {
        this.ctx.strokeStyle = strokeColor;
        this.ctx.strokeRect(center.x - size.x / 2, center.y - size.y / 2,
                            size.x / 2, size.y / 2);
      }

      if (fillColor !== undefined) {
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(center.x - size.x / 2, center.y - size.y / 2,
                          size.x, size.y);
      }
    }
  };

  var describeCircle = function(ctx, center, radius) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
  };
})(this);
