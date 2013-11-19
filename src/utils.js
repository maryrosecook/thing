;(function(exports) {
  exports.utils = {
    type: function(x) {
      return Object.prototype.toString.call(x).match(/\[object ([^\]]+)\]/)[1];
    }
  };
})(this);
