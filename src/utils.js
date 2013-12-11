;(function(exports) {
  exports.utils = {
    type: function(x) {
      return Object.prototype.toString.call(x).match(/\[object ([^\]]+)\]/)[1];
    },

    mixin: function(from, to) {
      for (var i in from) {
        to[i] = from[i];
      }
    }
  };
})(this);
