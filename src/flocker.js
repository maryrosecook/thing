;(function(exports) {
  exports.flocker = {
    getVector: function(firefly, otherFireflies, center, acceleration) {
      var vec = combine([
        { weight: 0.6, v: orbit(firefly, center) },
        { weight: 0.3, v: heading(otherFireflies) },
        { weight: 0.4, v: separation(firefly, otherFireflies, NEIGHBOR_DISTANCE) },
        { weight: 0.36, v: cohesion(firefly, otherFireflies) }
      ]);

      return {
        x: vec.x * acceleration,
        y: vec.y * acceleration,
      };
    }
  };

  var NEIGHBOR_DISTANCE = 20;

  var heading = function(members) {
    return sumVectors(_.pluck(members, 'vec'));
  };

  var orbit = function(member, center) {
    return Maths.vectorTo(member.center, center);
  };

  var separation = function(member, members, neighborDistance) {
    var vectorToNeighbors = sumVectors(_.map(members, function(x) {
      if (Maths.distance(member.center, x.center) < neighborDistance) {
        return Maths.vectorTo(member.center, x.center);
      } else {
        return { x: 0, y: 0 };
      }
    }));

    return { x: -vectorToNeighbors.x, y: -vectorToNeighbors.y };
  };

  var cohesion = function(member, members) {
    return sumVectors(_.map(members, function(x) {
      return Maths.vectorTo(member.center, x.center);
    }));
  };

  // normalize, combine based on weights
  var combine = function(vectorsAndWeights) {
    return _.reduce(vectorsAndWeights, function(a, e) {
      var unitV = Maths.unitVector(e.v);
      a.x += e.weight * unitV.x;
      a.y += e.weight * unitV.y;
      return a;
    }, { x: 0, y: 0 });
  };

  var sumVectors = function(vectors) {
    return _.reduce(vectors, function(a, v) {
      a.x += v.x;
      a.y += v.y;
      return a;
    }, { x: 0, y: 0 });
  };
})(this);
