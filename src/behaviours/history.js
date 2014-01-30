;(function() {
  this.history = {
    setup: function(owner, eventer, settings) {
      var buffer = new Buffer(settings.historySize);
      var interval = setInterval(function() {
        buffer.push(settings.fn());
      }, settings.interval);

      eventer.bind(this, "owner:destroy", function() {
        clearInterval(interval);
      });

      return {
        getHistory: function() {
          return buffer.all();
        }
      };
    }
  };

  var Buffer = function(size) {
    var buffer = [];

    this.push = function(item) {
      buffer.push(item);
      if (buffer.length > size) {
        buffer.shift();
      }
    };

    this.all = function() {
      return buffer.concat();
    };
  };
}).call(this);
