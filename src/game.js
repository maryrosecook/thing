;(function(exports) {
  exports.Game = function() {
    this.c = new Coquette(this, "canvas", 500, 500, "#000");
    this.drawer = new Drawer(this.c.renderer.getCtx());
    this.physics = new Physics(this, { x: 0, y: 0 });

    var gridWidthHeight = this.c.renderer.getViewSize().x * 0.8;
    this.c.entities.create(Grid, { gridWidthHeight: gridWidthHeight });
    this.stateMachine = new StateMachine({
      "": ["ready"],
      ready: ["playing"],
      playing: ["gameOver"],
      gameOver: ["playing"]
    });

    var self = this;
    this.setupImages(function () {
      self.initGame();
    });
  };

  exports.Game.prototype = {
    update: function(delta) {
      if (this.stateMachine.state === "playing") {
        this.c.renderer.setViewCenter(this.mary.center);
        this.physics.update(delta);
        director.update(delta, this);
      } else if (this.stateMachine.state === "ready" ||
                 this.stateMachine.state === "gameOver") {
        if (this.c.inputter.pressed(this.c.inputter.SPACE)) {

          this.stateMachine.transition("playing");
        }
      }
    },

    setupImages: function(callback) {
      var self = this;
      var viewCenter = this.c.renderer.getViewCenter();
      images.load({
        startGame: { url: "/images/startgame.png", size: { x: 200, y: 100 } },
        gameOver:  { url: "/images/gameover.png", size: { x: 200, y: 100 } }
      }, function(images) {
        self.images = images;
        self.images.startGame.center = { x: 0, y: 0 };
        self.images.gameOver.center = { x: 0, y: 0 };
        callback();
      });
    },

    initGame: function() {
      var viewCenter = this.c.renderer.getViewCenter();

      var self = this;
      self.c.entities.create(Mary, {
        center: { x:viewCenter.x, y:viewCenter.y }
      }, function(mary) {
        self.mary = mary;

        self.c.entities.create(Isla, {
          center: { x:viewCenter.x - 5, y:viewCenter.y - 22 }
        }, function(isla) {
          self.isla = isla;
          andro.augment(self.isla, "owner:destroy", function() {
            self.stateMachine.transition("gameOver");
          });
          director.reset(self);
          self.stateMachine.transition("ready");
        });
      });
    },

    restartGame: function() {

    },

    draw: function(ctx) {
      if (this.stateMachine.state === "ready") {
        var viewCenter = this.c.renderer.getViewCenter();
        ctx.translate(viewCenter.x, viewCenter.y);
        this.images.startGame.draw(ctx);
        ctx.translate(-viewCenter.x, -viewCenter.y);
      } else if (this.stateMachine.state === "playing") {
        this.physics.draw();
      } else if (this.stateMachine.state === "gameOver") {
        var viewCenter = this.c.renderer.getViewCenter();
        ctx.translate(viewCenter.x, viewCenter.y);
        this.images.startGame.draw(ctx);
        ctx.translate(-viewCenter.x, -viewCenter.y);
      }
    }
  };
})(this);
