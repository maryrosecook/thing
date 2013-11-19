;(function(exports) {
  exports.StateMachine = function(transitions) {
    this.state = "";
    this.transitions = transitions;
  };

  exports.StateMachine.prototype = {
    transition: function(newState) {
      if (this.transitions[this.state] !== undefined &&
          contains(newState, this.transitions[this.state])) {
        this.state = newState;
      } else {
        throw "Tried to transition to " + newState + " from " + this.state;
      }
    }
  };

  var contains = function(item, array) {
    for (var i = 0; i < array.length; i++) {
      if (item === array[i]) {
        return true;
      }
    }
    return false;
  };
})(this);
