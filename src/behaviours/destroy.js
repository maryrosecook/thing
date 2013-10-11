;(function(exports) {
  exports.destroy = {
    setup: function(owner) {
      return {
        destroy: function() {
          owner.game.c.entities.destroy(owner);
          owner.game.physics.destroyBody(owner.body);
          andro.eventer(owner).emit('owner:destroy');
        }
      }
    }
  }
}(this));
