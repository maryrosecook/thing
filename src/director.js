;(function(exports) {
  exports.director = {
    update: function(__, game) {
      if (game.c.entities.all(Monster).length < 3) {
        createMonster(game, game.isla.center, 600);
      }

      if (game.c.entities.all(Light).length < 3) {
        createLight(game, game.mary.center, 300);
      }
    },

    dummyEntity: function(Constructor, center) {
      return { center: center, size: Constructor.SIZE, shape: Constructor.SHAPE };
    },

    reset: function(game) {
      destroyAll(game.c.entities.all(Light));
      destroyAll(game.c.entities.all(Monster));
    }
  };

  var destroyAll = function(entities) {
    for (var i = 0; i < entities.length; i++) {
      entities[i].destroy();
    }
  };

  var createLight = function(game, center, minDistance) {
    var dummy = director.dummyEntity(Light,
                                     Maths.surroundingSpawnPoint(center, minDistance));
    if (game.physics.freeSpace(dummy)) {
      game.c.entities.create(Light, { center: dummy.center });
    } else {
      createLight.apply(null, arguments);
    }
  };

  var createMonster = function(game, center, minDistance) {
    var dummy = director.dummyEntity(Monster,
                                     Maths.surroundingSpawnPoint(center, minDistance));
    if (!game.c.renderer.onScreen(dummy) &&
        game.physics.freeSpace(dummy)
        // raytracer.visible(game.isla, dummy, game.c.entities.all(Square))
       ) {
      game.c.entities.create(Monster, { center: dummy.center });
    } else {
      createMonster.apply(null, arguments);
    }
  };
}(this));
