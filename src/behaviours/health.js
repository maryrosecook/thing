;(function() {
  this.health = {
    setup: function(owner, eventer, settings) {
      this.health = settings.health;

      return {
        getHealth: function() {
          return this.health;
        },

        setHealth: function(health) {
          return this.health = health;
        },

        getMaxHealth: function() {
          return settings.maxHealth;
        },

	      receiveDamage: function(amount, from) {
          if(this.health > 0) { // health gets decremented multiple times for some weird reason
		        this.health -= amount;
            eventer.emit("health:receiveDamage", from);
		        if(this.health <= 0) {
              owner.destroy();
		        }
          }
        }
      }
    }
  }
}).call(this);
