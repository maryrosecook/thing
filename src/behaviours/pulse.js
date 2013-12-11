;(function() {
  this.pulse = {
    setup: function(owner, eventer, settings) {
      var rgbColor = settings.rgb.concat(); // eg [255, 255, 0], each must be 255 or 0
      var colorsToCycle = settings.colorsToCycle; // eg [1, 1, 0], each must be 1 or 0
      var brightness = 255;
      var change;

      eventer.bind(this, "pulse:start", function(data) {
        eventer.bind(this, "owner:update", function() {
          if (brightness === 120) {
            change = data.speed;
          } else if (brightness === 255) {
            change = -data.speed;
          }

          brightness += change;
          _.each(colorsToCycle, function(x, i) {
            if (x === 1) {
              rgbColor[i] += change;
            }
          });
        });
      });

      eventer.bind(this, "pulse:stop", function() {
        change = undefined;
        brightness = 255;
        rgbColor = settings.rgb.concat();
        eventer.unbind(this, "owner:update");
      });


      return {
        getColor: function() {
          return rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);
        }
      };
    }
  };

  var componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  var rgbToHex = function(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };
}).call(this);
