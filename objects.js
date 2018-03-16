"use strict";

function GameObject(name="Potato") {
  this.name = name;
  this.actions = [];
}

function Nerd() {
  GameObject.call(this, "Nerd");
  this.actions.push({
    "name": "Eat Nerd",
    "action": function() {
      startDialog(new EatDude());
    }
  });
}

function Toilet() {
  GameObject.call(this, "Toilet");
  this.actions.push({
    "name": "Admire toilet",
    "action": function() {
      update(["You admire the toilet."]);
    }
  });
  this.actions.push({
    "name": "Use toilet",
    "action": function() {
      let lines = [];

      lines.push("You sit down on the toilet.");

      if (player.bowels.fullness == 0) {
        lines.push("But nothing happens.");
      } else {
        lines.push("You grunt and clench, squeezing out the remains of your former prey.");
        player.bowels.fullness = 0;
      }

      if (player.bowels.contents.length > 0) {
        lines.push("The remains of " + join(player.bowels.contents) + " empty into the sewers as you flush them away.");
      }

      player.bowels.contents = [];

      update(lines);
    },
    "conditions": [
      function(prefs) {
        return prefs.scat == true;
      }
    ]
  });
}

function TV() {
  GameObject.call(this, "TV");
  this.actions.push({
    "name": "Watch TV",
    "action": function() {
      update(["Reruns, again."]);
    }
  });
}

function Phone() {
  GameObject.call(this, "Phone");
  this.actions.push({
    "name": "Use phone",
    "action": function() {
      startDialog(new PhoneCall());
    }
  });
}

function Bed() {
  GameObject.call(this, "Bed");
  this.actions.push({
    "name": "Sleep",
    "action": function() {
      update(["You take a nap."]);
      advanceTime(2700);
      updateDisplay();
    }
  });
  this.actions.push({
    "name": "Save Game",
    "action": function() {
      saveGame();
      update(["Game saved."]);
      updateDisplay();
    }
  });
  this.actions.push({
    "name": "Load Game",
    "action": function() {
      loadGame();
      update(["Game loaded."]);
      updateDisplay();
    }
  });
}

function Journal() {
  GameObject.call(this, "Journal");
  this.actions.push({
    "name": "Read Journal",
    "action": function() {
      if (deaths.length == 0)
        update(["You pick up the journal and read it.",newline,"It's empty."]);
      else
        update(["You pick up the journal and read it.",newline].concat(deaths));
    }
  });
}

function Sofa() {
  GameObject.call(this, "Sofa");
  this.actions.push({
    "name": "Sit on sofa",
    "action": function(){
      startDialog(SofaSit());
    }
  });
}

function NatureTrailExercise() {
  GameObject.call(this, "Exercise");
  this.actions.push({
    "name": "Exercise",
    "action": function() {
      startDialog(new NatureExercise());
    }
  });
}

function VendingMachine() {
  GameObject.call(this, "Vending Machine");

  this.actions.push({
    "name": "Use the vending machine",
    "action": function() {
      startDialog(new VendingMachinePurchase());
    }
  });
}

function WildernessExplore(natureTrail) {
  GameObject.call(this, "Explore the Wilderness");

  this.actions.push({
    "name": "Explore",
    "action": function() {
      let outcome = Math.random();
      advanceTime(60*15);

      if (outcome < 0.3) {
        moveToByName("Nature Trail", "You find your way back");
      } else if (outcome < 0.5) {
        startCombat(new Trance());
      } else if (outcome < 0.7) {
        startCombat(new Taluthus());
      } else {
        update(["You wander around for a bit, but haven't found anything."]);
      }
    }
  });

  this.actions.push({
    "name": "Taluthus",
    "action": function() {
      startCombat(new Taluthus());
    }
  });

  this.actions.push({
    "name": "Selicia",
    "action": function() {
      startCombat(new Selicia());
    }
  });
}
