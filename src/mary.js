;(function(exports) {
  exports.Mary = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.color = "#00f";
    this.body = game.physics.createBody(this, {
      shape: "circle",
      pos: settings.pos,
      size: { x: 20, y: 20 },
    });

    andro.augment(this, destroy);
    andro.augment(this, push);
  };

  exports.Mary.prototype = {
    SPEED: 0.0002,
    SPEED_LIMIT: 0.1,
    DRAG_RATIO: 0.005,

    update: function(delta) {
      this.handleKeyboardInput();
      this.body.update();
      this.body.drag(this.DRAG_RATIO);
      andro.eventer(this).emit('owner:update');
    },

    collision: function(other, type) {
      if (type === "add" && other instanceof Monster) {
        other.receiveDamage(10);
      }
    },

    handleKeyboardInput: function() {
      var inputter = this.game.c.inputter;
      var vec = { x: 0, y: 0 };

      if (inputter.down(inputter.LEFT_ARROW)) {
        vec.x = -this.SPEED;
      } else if (inputter.down(inputter.RIGHT_ARROW)) {
        vec.x = this.SPEED
      }

      if (inputter.down(inputter.UP_ARROW)) {
        vec.y = -this.SPEED;
      } else if (inputter.down(inputter.DOWN_ARROW)) {
        vec.y = this.SPEED;
      }

      if (inputter.pressed(inputter.SPACE)) {
        this.game.isla.follow(this);
      }

      var unitVec = Maths.unitVector(vec);
      var pushVec = {
        x: unitVec.x * this.SPEED,
        y: unitVec.y * this.SPEED,
      };

      this.body.push(pushVec)
    },

    draw: function(ctx) {
      this.game.drawer.circle(this.pos, this.size.x / 2, undefined, this.color);
    }
  };
})(this);
