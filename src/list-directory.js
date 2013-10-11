;(function(exports) {
  exports.DirectoryList = function() {
    this._files = [];
  };

  exports.DirectoryList.prototype = {
    get: function() {
      return this._files;
    },

    list: function(path, recursive) {
      this._files = this._files.concat(getList(path, recursive));
      return this;
    },

    select: function(regex) {
      this._files = select(this._files, function(x) { return new RegExp(regex).test(x); });
      return this;
    },

    reject: function(regex) {
      this._files = select(this._files, function(x) { return !new RegExp(regex).test(x); });
      return this;
    },

    removeAll: function(removables) {
      for (var i = 0; i < this._files.length; i++) {
        for (var j = 0; j < removables.length; j++) {
          if (this._files[i] === removables[j]) {
            this._files.splice(i, 1);
          }
        }
      }
      return this;
    }
  };

  var select = function(_array, selectPredicate) {
    var array = _array.concat();
    for (var i = 0; i < array.length; i++) {
      if (!selectPredicate(array[i])) {
        array.splice(i, 1);
      }
    }
    return array;
  };

  var getList = function(path, recursive) {
    var out = [];
    var files = parseFilesFromListing(getListing(path));
    for (var i = 0; i < files.length; i++) {
      if (isDirectory(files[i])) {
        if (recursive === true) {
          out = out.concat(getList(path + files[i], recursive));
        }
      } else {
        out.push(path + files[i])
      }
    }
    return out;
  };

  var parseFilesFromListing = function(listing) {
    var files = [];
    var rawFiles = listing.match(/=\"[^\"]+\"/g);
    for (var i = 0; i < rawFiles.length; i++) {
      files.push(rawFiles[i].replace(/"/g, "").replace('=', ""));
    }
    return files;
  };

  var getListing = function(path) {
    var response;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        response = xhr.responseText;
      }
    };

    xhr.send(null, false);
    return response;
  };

  var isDirectory = function(str) {
    return /\/$/.test(str);
  };

  var extend = function(to, from) {
    for (var i in from) {
      to[i] = from[i];
    }
  };
}(this));
