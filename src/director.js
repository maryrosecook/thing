;(function(exports) {
  exports.Director = function(game) {
    this.game = game;
  };

  exports.Director.prototype = {
    update: function() {
      if (this.game.c.entities.all(Monster).length < 3) {
        createMonster(this.game,
                      this.game.isla.pos,
                      300,
                      { x: 5, y: 5 });
      }
    }
  };

  var createMonster = function(game, center, minDistance, size) {
    var entity = {
      pos: surroundingSpawnPoint(center, minDistance),
      size: size,
      shape: "circle"
    };

    if (!game.c.renderer.onScreen(entity) &&
        game.physics.freeSpace(entity) &&
        raytracer.visible(game.isla, entity, game.c.entities.all(Square))) {
      game.c.entities.create(Monster, { pos: entity.pos, size: size });
    } else {
      createMonster.apply(null, arguments);
    }
  };

  var surroundingSpawnPoint = function(center, minDistance) {
    var rand = Math.random();
    if (rand < 0.25) { // top
      return {
        x: center.x - Maths.spread(minDistance * 2),
        y: center.y - minDistance
      };
    } else if (rand < 0.5) { // right
      return {
        x: center.x + minDistance,
        y: center.y - Maths.spread(minDistance * 2)
      };
    } else if (rand < 0.75) { // bottom
      return {
        x: center.x - Maths.spread(minDistance * 2),
        y: center.y + minDistance
      };
    } else { // left
      return {
        x: center.x - minDistance,
        y: center.y - Maths.spread(minDistance * 2)
      };
    }
  };
}(this));
