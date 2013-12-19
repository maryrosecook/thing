;(function(exports) {
  exports.seq = {
    all: function(fns, cb) {
      var results = [];
      (function handleAllFnsDone() {
        console.log("handle", results.length, fns.length)
        if (results.length === fns.length) {
          cb(results);
        }
      })();

      var fnDone = function(result) {
        console.log(fnDone)
        results.push(results);
        handleAllFnsDone();
      };

      for (var i = 0; i < fns.length; i++) {
        fns[i](fnDone);
      }
    }
  };
})(this);
