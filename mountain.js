function MountainExplore() {
  GameObject.call(this, "Explore");

  this.actions.push({
    "name": "Explore",
    "action": function() {
      let outcome = Math.random();
      advanceTime(60*15);

      if (outcome < 0.25) {
        startCombat(new MountainWyrm());
      } else {
        update(["You wander around for a bit, but haven't found your way out yet."]);
      }
    }
  });
}

function MountainWyrm() {
  Creature.call(this, "Wyrm", 25, 15, 35);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " wyrm"; };

  this.attacks = [];

  this.flags.state = "combat";
  this.flags.roars = 0;

  this.flags.cockDepth = 0;

  this.attacks.push(wyrmBite(this));
  this.attacks.push(wyrmTail(this));
  this.attacks.push(wyrmRoar(this));

  this.attacks.push(wyrmPounce(this));

  this.attacks.push(wyrmGrind(this));
  this.attacks.push(wyrmCockVore(this));

  this.attacks.push(wyrmCockSwallow(this));
  //this.attacks.push(wyrmCockCrush(this));

  this.attacks.push(wyrmBallsDigest(this));

  this.playerAttacks = [];

  this.playerAttacks.push(punchAttack);
  this.playerAttacks.push(flankAttack);

  this.playerAttacks.push(cockStruggle);
  this.playerAttacks.push(ballStruggle);

  this.playerAttacks.push(pass);
  this.playerAttacks.push(flee);

  this.startCombat = function(player) {
    return ["A shadow falls over you; a heartbeat later, a hound-sized wyrm swoops down, landing with a heavy <i>thump</i> on the rocky ground. He hisses and snarls at you, rearing up in an attempt to intimidate you..and showing off his throbbing shaft."];
  };

  this.finishCombat = function() {
    if (this.flags.state == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.state == "balls")
      return ["You fall limp in " + this.description("the") + "'s balls."];
  };
}

function wyrmBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str);
      return [attacker.description("The") + " rushes up and bites you for " + damage + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + defender.health/defender.maxHealth; }
  };
}

function wyrmTail(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.dex);
      return [attacker.description("The") + " lashes at you with his tail, dealing " + damage + " damage."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + defender.health/defender.maxHealth; }
  };
}

function wyrmRoar(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.flags.roars += 1;
      attacker.statBuffs.push(new StatBuff("str", 1.25));
      attacker.statBuffs.push(new StatBuff("con", 1.25));
      return [attacker.description("The") + " lets out an earsplitting roar. It looks even angrier now."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      },
      function(attacker, defender) {
        return attacker.flags.roars < 2;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.25 + attacker.flags.roars / 2; }
  };
}

function wyrmPounce(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "dex")) {
        attacker.flags.state = "grapple";
        defender.flags.grappled = true;
        return ["The wyrm dives out of sight, vanishing behind an outcropping of jagged rock. You cautiously approach, peeking around the corner. You see nothing - and then, suddenly, the beast pounces from behind, driving you to the ground!"];
      } else {
        return ["The wyrm leaps out of sight, vanishing behind a jagged outcropping of rock. You creep up and peer around the corner, seeing nothing. A scrabble of claws on rock draws your attention, and you manage to duck as the beast comes careening in, leaping too high and slamming into the wall instead! Sneaky bastard..."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) {
      return 2.5 - 2 * defender.healthPercentage();
    }
  };
}

function wyrmGrind(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str / 3);
      defender.changeStamina(-35);
      return ["You squirm as the wyrm grinds his throbbing red shaft along your body, painting your chest and face with hot, musky fluids."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage(); }
  };
}

function wyrmCockVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "cock";
        attacker.flags.cockDepth = 1;
        defender.changeStamina(-25);
        return ["A gasp escapes your lips as the wyrm's turgid cock thrusts forward, sealing over your head! The hot, slick flesh clenches tightly as the beast growls in pleasure, thrusting and humping on your flailing body."];
      } else {
        return ["The wyrm's hot shaft thrusts forward, briefly enveloping your head in musky flesh. It finds no purchase, though, and you manage to push yourself free."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.cock > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) {return 2 - defender.staminaPercentage(); }
  };
}

function wyrmCockSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.cockDepth += 1;
      if (attacker.flags.cockDepth == 5) {
        attacker.flags.state = "balls";
        return ["A final clench of cock-flesh sucks you down into the wyrm's massive, sloshing balls."];
      } else if (attacker.flags.cockDepth == 4) {
        return ["The outside world is distant now - even your toes are enveloped, and your upper body is submerged in cum."];
      } else if (attacker.flags.cockDepth == 3) {
        return ["Your head is shoved deeper into a thick layer of the wyrm's seed, his powerful cock impossible to resist."];
      } else if (attacker.flags.cockDepth == 2) {
        return ["A powerful <i>glrkph</i> stuffs your head into the wyrm's balls - you're quite a bit larger than it, with your lower body still free...but it's not stopping the horny beast."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyrmBallsDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 25);
      return ["The wyrm's overstuffed balls churn, swiftly melting you down into dragon seed."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Melted down to seed and sprayed out by " + attacker.description("a"); }
  };
}


function cockStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to pull yourself from the wyrm's cock!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.cockDepth -= 1;
        if (defender.flags.cockDepth == 3) {
          return ["You summon up all your strength and push yourself back from the brink, choking on cum and struggling for your life."];
        } else if (defender.flags.cockDepth == 2) {
          return ["You shove yourself further back - still perilously deep in the wyrm's turgid cock, but now halfway free."];
        } else if (defender.flags.cockDepth == 1) {
          return ["A mighty shove leaves you with only your head ensnared in that hungry shaft. The wyrm growls and snarls, clearly upset at the thought of his prey escaping!"];
        } else if (defender.flags.cockDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to free yourself! A spray of musky precum lashes the rocks as your head pops loose. You rise up onto your foot, ready to continue the fight."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "cock"; }
    ],
    priority: 1,
  };
}

function ballStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyrm's balls!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "cock";
        defender.flags.cockDepth = 3;
        return ["You struggle and squirm, forcing yourself back into the wyrm's throbbing cock. He's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but to no avail."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "balls"; }
    ],
    priority: 1,
  };
}
