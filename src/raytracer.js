;(function(exports) {
  exports.raytracer = {
    visible: function(obj1, obj2, entities) {
      var line = [
        Coquette.Collider.Maths.center(obj1),
        Coquette.Collider.Maths.center(obj2),
      ];

      for (var i = 0; i < entities.length; i++) {
        if (entities[i].body !== undefined &&
            entities[i] !== obj1 &&
            entities[i] !== obj2) {
          if (lineIntersectionTests[entities[i].shape](line, entities[i])) {
            return false;
          }
        }
      }

      return true;
    }
  };

  var lineIntersectionTests = {
    rectangle: function(line, rectangleObj) {
      var corners = Coquette.Collider.Maths.rectangleCorners(rectangleObj);
      var lines = pairs(corners).concat([[corners[3], corners[0]]]);
      for (var i = 0; i < lines.length; i++) {
        if (isLineIntersectingLine(line, lines[i])) {
          return true;
        }
      }

      return false;
    },

    circle: function() {
      throw "no circle line intersection test written, yet";
    }
  };


  var isLineIntersectingLine = function(line1, line2) {
    var p1 = line1[0];
    var p2 = line1[1];
    var p3 = line2[0];
    var p4 = line2[1];
    var d = ((p4.y - p3.y) * (p2.x - p1.x)) - ((p4.x - p3.x) * (p2.y - p1.y));
    var n1 = ((p4.x - p3.x) * (p1.y - p3.y)) - ((p4.y - p3.y) * (p1.x - p3.x));
    var n2 = ((p2.x - p1.x) * (p1.y - p3.y)) - ((p2.y - p1.y) * (p1.x - p3.x));

    if (d === 0.0 || (n1 === 0.0 && n2 === 0.0)) {
      return false;
    }
    var ua = n1 / d;
    var ub = n2 / d;

    return ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0;
  };

  var pairs = function(l) {
    return l.length === 0 || l.length === 1 ? [] : [[l[0], l[1]]].concat(pairs(l.slice(1)));
  };
}(this));
