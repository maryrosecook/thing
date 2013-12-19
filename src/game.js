;(function(exports) {
  exports.Game = function() {
    this.c = new Coquette(this, "canvas", 500, 500, "#000");
    this.drawer = new Drawer(this, this.c.renderer.getCtx());
    this.physics = new Physics(this, { x: 0, y: 0 });
    this.director = new Director(this);
    this.radar = new Radar(this);
    this.grid = new Grid(this, this.c.renderer.getViewSize().x * 0.8);

    this.stateMachine = new StateMachine({
      "": ["started"],
      started: ["playing"],
      playing: ["gameOver"],
      gameOver: ["playing"]
    });

    var self = this;
    this.setupImages(function () {
      self.stateMachine.transition("started");
      self.restartGame();
    });
  };

  exports.Game.prototype = {
    update: function(delta) {
      this.physics.update(delta);

      if (this.stateMachine.state === "playing") {
        this.director.update(delta);
        this.drawer.moveViewTowards(this.mary.center, 0.1);
      } else if (this.stateMachine.state === "started" ||
                 this.stateMachine.state === "gameOver") {
        this.drawer.moveViewTowards(this.mary.center, 0.07);
        if (this.c.inputter.isPressed(this.c.inputter.LEFT_ARROW) ||
            this.c.inputter.isPressed(this.c.inputter.RIGHT_ARROW) ||
            this.c.inputter.isPressed(this.c.inputter.UP_ARROW) ||
            this.c.inputter.isPressed(this.c.inputter.DOWN_ARROW)) {
          this.stateMachine.transition("playing");
        }
      }
    },

    setupImages: function(callback) {
      var self = this;
      images.load({
        startGame: { url: "/images/startgame.png", size: { x: 200, y: 100 } },
        instructions: { url: "/images/instructions.png", size: { x: 200, y: 200 } },
        gameOver:  { url: "/images/gameover.png", size: { x: 200, y: 100 } }
      }, function(images) {
        self.images = images;
        self.images.startGame.center = { x: 236, y: 177 };
        self.images.instructions.center = { x: 228, y: 92 };
        self.images.gameOver.center = { x: 236, y: 177 };
        callback();
      });
    },

    restartGame: function() {
      var viewSize = this.c.renderer.getViewSize();
      var home = this.drawer.getHome();

      var self = this;
      self.c.entities.create(Mary, {
        center: { x: home.x, y: home.y }
      }, function(mary) {
        self.mary = mary;

        self.c.entities.create(Isla, {
          center: { x: home.x - 72, y: home.y - 72 }
        }, function(isla) {
          self.isla = isla;
          self.director.start();

          andro.augment(self.isla, {
            setup: function(__, eventer) {
              eventer.bind(this, "owner:destroy", function() {
                setTimeout(function() {
                  self.mary.destroy();
                  self.director.reset();
                  self.director.destroyAll();
                  self.stateMachine.transition("gameOver");

                  setTimeout(function() {
                    self.restartGame();
                  }, 1000);
                }, 500);
              });
            }
          });
        });
      });
    },

    draw: function(ctx) {
      this.grid.draw();

      if (this.stateMachine.state !== "") {
        this.images.instructions.draw(ctx);

        if (this.stateMachine.state === "started") {
          this.images.startGame.draw(ctx);
        } else if (this.stateMachine.state === "playing") {
          this.physics.draw();
          this.radar.draw(ctx);
        } else if (this.stateMachine.state === "gameOver") {
          this.images.gameOver.draw(ctx);
        }
      }
    }
  };
})(this);
