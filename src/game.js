;(function(exports) {
  exports.Game = function() {
    this.c = new Coquette(this, "canvas", 600, 600, "#000");
    this.drawer = new Drawer(this, this.c.renderer.getCtx());
    this.physics = new Physics(this, { x: 0, y: 0 });
    this.director = new Director(this);
    this.radar = new Radar(this);
    this.grid = new Grid(this, this.c.renderer.getViewSize().x * 0.8);
    this.scoreboard = new Scoreboard(this, this.c.renderer.getViewSize().x * 0.8);

    this.c.renderer.setViewCenter(this.drawer.getHome());

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

    this.particleGhosts = [];
  };

  exports.Game.prototype = {
    update: function(delta) {
      this.physics.update(delta);

      if (this.stateMachine.state === "playing") {
        this.director.update(delta);
        this.drawer.moveViewTowards(this.mary.center, 0.1);
      } else if (this.stateMachine.state === "started") {
        this.drawer.moveViewTowards(this.mary.center, 0.07);
        this.listenForStartKey();
      } else if (this.stateMachine.state === "gameOver") {
        this.drawer.moveViewTowards(this.mary.center, 0.07);
        this.listenForStartKey();
      }
    },

    listenForStartKey: function() {
      if (this.c.inputter.isPressed(this.c.inputter.LEFT_ARROW) ||
          this.c.inputter.isPressed(this.c.inputter.RIGHT_ARROW) ||
          this.c.inputter.isPressed(this.c.inputter.UP_ARROW) ||
          this.c.inputter.isPressed(this.c.inputter.DOWN_ARROW)) {
        this.stateMachine.transition("playing");
      }
    },

    setupImages: function(callback) {
      var self = this;
      images.load({
        keys: { url: "/images/keys.png", size: { x: 200, y: 200 } },
        startGame: { url: "/images/startgame.png", size: { x: 200, y: 100 } },
        instructions: { url: "/images/instructions.png", size: { x: 200, y: 200 } },
        gameOver:  { url: "/images/gameover.png", size: { x: 200, y: 100 } },
        version:  { url: "/images/version.png", size: { x: 250, y: 200 } }
      }, function(images) {
        self.images = images;
        self.images.keys.center = { x: 190, y: 158 };
        self.images.startGame.center = { x: 267, y: 207 };
        self.images.instructions.center = { x: 259, y: 122 };
        self.images.gameOver.center = { x: 267, y: 207 };
        self.images.version.center = { x: 176, y: 193 };
        callback();
      });
    },

    restartGame: function() {
      var viewSize = this.c.renderer.getViewSize();
      var home = this.drawer.getHome();

      this.mary = this.c.entities.create(Mary, {
        center: { x: home.x, y: home.y }
      });

      this.isla = this.c.entities.create(Isla, {
        center: { x: home.x - 88, y: home.y - 88 }
      });

      // this.link = new Link(game, { fromObj: this.mary, toObj: this.isla });

      var self = this;
      andro.augment(this.isla, {
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

      this.director.start();
    },

    draw: function(ctx) {
      this.grid.draw(ctx);
      // this.scoreboard.draw(ctx);

      if (this.stateMachine.state !== "") {
        this.images.keys.draw(ctx);
        if (this.stateMachine.state === "started") {

        } else if (this.stateMachine.state === "playing") {
          this.physics.draw();
          this.radar.draw(ctx);

          if (this.isla.arm !== undefined) {
            this.isla.arm.draw(ctx);
          }

          // if (this.link !== undefined) {
          //   this.link.draw();
          // }
        } else if (this.stateMachine.state === "gameOver") {
        }
      }

      for (var i = 0, len = this.particleGhosts.length; i < len; i++) {
        var particleGhost = this.particleGhosts[i];
        this.drawer.circle(particleGhost.center, 0.5,
                           undefined, particleGhost.color);
      }
    }
  };

  var Link = function(game, settings) {
    this.game = game;
    this.fromObj = settings.fromObj;
    this.toObj = settings.toObj;
  };

  Link.prototype = {
    draw: function() {
      this.game.drawer.line(this.fromObj.center, this.toObj.center, 1, "#333");
    }
  };
})(this);
