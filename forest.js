function ForestExplore() {
  GameObject.call(this, "Explore the Forest");

  this.actions.push({
    "name": "Explore",
    "action": function() {
      let outcome = Math.random();
      advanceTime(60*30 * (Math.random() * 0.2 + 0.9));

      if (outcome < 0.35) {
        currentRoom.flags.exit = true;
        update(["You find a way back!"]);
      } else if (outcome < 0.5) {
        startCombat(new Wolf());
      } else if (outcome < 0.6) {
        startCombat(new AlphaWolf());
      } else if (outcome < 0.75) {
        startCombat(new Anaconda());
      } else {
        update(["You explore the forest for a while, but don't find anything."]);
      }
    }
  });

  this.actions.push({
    "name": "Leave",
    "action": function() {
      moveToByName("East Trail", "You leave the forest");
    },
    "conditions": [
      function(player) {
        return currentRoom.flags.exit;
      }
    ]
  });
}

function Wolf() {
  Creature.call(this, "Wolf", 10, 15, 15);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " wolf"; };

  this.attacks = [];

  this.attacks.push(wolfBite(this));
  this.attacks.push(wolfHowl(this));

  this.attacks.push(wolfTackle(this));
  this.attacks.push(wolfTackleBite(this));
  this.attacks.push(wolfTackleSwallow(this));

  this.attacks.push(grappledStruggle(this));

  this.backupAttack = pass(this);

  this.struggles = [];

  this.struggles.push(new struggle(this));
  this.struggles.push(new submit(this));

  this.digests = [];

  this.digests.push(wolfDigest(this));
  this.digests.push(wolfBelch(this));

  this.flags.stage = "combat";

  this.startCombat = function(player) {
    return ["A snapping twig grabs your attention. You turn and find yourself facing a large, mangy wolf. The cur stands at least half your height at the shoulder, and it looks <i>hungry.</i>"];
  };

  this.finishCombat = function() {
    if (this.flags.stage == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.stage == "oral")
      return ["You fall limp in " + this.description("the") + "'s roiling guts, melting away to feed the mangy predator for a good, long time..."];
  };

  this.status = function(player) {
    return [];
  };
}

function AlphaWolf() {
  Creature.call(this, "Alpha Wolf", 20, 20, 20);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " alpha wolf"; };

  this.attacks = [];

  this.attacks.push(wolfBite(this));
  this.attacks.push(wolfHowl(this));

  this.attacks.push(wolfTackle(this));
  this.attacks.push(wolfTackleBite(this));
  this.attacks.push(wolfTackleSwallow(this));

  this.attacks.push(wolfSwallow(this));

  this.attacks.push(grappledStruggle(this));
  this.attacks.push(grappledReverse(this));

  this.backupAttack = pass(this);

  this.struggles = [];

  this.struggles.push(new struggle(this));
  this.struggles.push(new submit(this));

  this.digests = [];

  this.digests.push(wolfDigest(this));
  this.digests.push(wolfBelch(this));

  this.flags.stage = "combat";

  this.startCombat = function(player) {
    return ["A low growl sends a chill up your spine. You turn around slowly, coming face-to-face with a massive, snarling wolf. Nearly six feet tall at the shoulder, the beast is eyeing you up as a snack."];
  };

  this.finishCombat = function() {
    if (this.flags.stage == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.stage == "oral")
      return ["You fall limp in " + this.description("the") + "'s roiling guts, melting away to feed the mangy predator for a good, long time..."];
  };

  this.status = function(player) {
    return [];
  };
}

function wolfBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str);
      return [attacker.description("The") + " jumps at you, biting for " + damage + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + defender.health/defender.maxHealth; }
  };
}

function wolfHowl(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.statBuffs.push(new StatBuff("str", 1.25));
      return [attacker.description("The") + " backs up and lets out a long, wailing howl.",newline,"It seems emboldened."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.25; }
  };
}


function wolfTackle(attacker) {
  return {
    attackPlayer: function(defender){
      defender.flags.grappled = true;
      return [attacker.description("The") + " leaps on top of you, pinning you to the ground!"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1.25 - defender.health/defender.maxHealth; }
  };
}

function wolfTackleBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str * 1.5);
      return pickRandom([
        ["Pain shoots through your arm as " + attacker.description("the") + " bites it for " + damage + " damage!"],
        ["You struggle against " + attacker.description("the") + " as it bites your shoulder for " + damage + " damage."],
        [attacker.description("The") + "'s claws dig into your legs for " + damage + " damage."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + defender.health/defender.maxHealth; }
  };
}

function wolfTackleSwallow(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.flags.stage = "oral";
      changeMode("eaten");
      return ["You struggle against " + attacker.description("the") + ", but it's not enough - its greedy jaws envelop your head, then your shoulders. The hungry beast swallows you down in seconds, cramming you into its hot, slimy stomach."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.oral > 0;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wolfSwallow(attacker) {
  return {
    attackPlayer: function(defender){
      let success = statCheck(attacker, defender, "dex") || defender.stamina == 0;
      if (success) {
        attacker.flags.stage = "oral";
        changeMode("eaten");
        return [attacker.description("The") + " charges, closing the gap in the blink of an eye and jamming your upper body into its massive, drool-slathered maw. <i>Glrp, glllpkh, gulp</i> - and you're in its throat, thrashing and struggling as you plunge into the greedy beast's sloppy stomach."];
      } else {
        return [attacker.description("The") + " lunges at you, racing up with jaws splayed wide open. You leap to the side, barely avoiding the greedy beast's maw as it barrels past, growling and snapping in frustration."];
      }
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.oral > 0;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wolfDigest(attacker) {
  return {
    digest: function(defender){
      let damage = attack(attacker, defender, attacker.str * 3);
      return [attacker.description("The") + "'s churning guts wear you down."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Digested by " + attacker.description("a"); }
  };
}

function wolfBelch(attacker) {
  return {
    digest: function(defender){
      defender.stamina -= 50;
      let damage = attack(attacker, defender, attacker.str * 2);
      return [attacker.description("The") + " lets out a crass <i>BELCH</i>, draining air from its snarling gut and squeezing you even tighter than before."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Reduced to a belch by " + attacker.description("a"); }
  };
}

function Anaconda() {
  Creature.call(this, "Anaconda", 60, 10, 20);

  this.hasName = false;

  this.description = function(prefix) {
    if (prefix == "a")
      return "an anaconda";
    if (prefix == "A")
      return "A anaconda";
    else
     return prefix + " anaconda";
   };

  this.flags.state = "combat";

  this.flags.tail = {};
  this.flags.oral = {};
  this.flags.grapple = {};
  this.flags.stomach = {};

  this.stomachPull = function(amount) {
    this.flags.stomach.depth += amount;

    this.flags.stomach.depth = Math.max(0, this.flags.stomach.depth);
    this.flags.stomach.depth = Math.min(30, this.flags.stomach.depth);
  };

  this.startCombat = function(player) {
    return ["An anaconda slithers from the bushes."];
  };

  this.finishCombat = function() {
    if (this.flags.state == "combat")
      return ["You fall to your knees, barely aware as the anaconda lashes forward to gulp you down..."];
    else if (this.flags.state == "oral")
      return ["You black out in the snake's crushing throat. At least you won't have to experience your slow digestion..."];
    else if (this.flags.state == "stomach")
      return ["The snake's stomach is too much to bear, and you black out as your body begins to collapse under the pressure."];
  };

  this.status = function() {
    if (this.flags.state == "oral") {
      switch(this.flags.oral.depth) {
        case 1: return ["You're trapped at the top of the serpent's throat."];
        case 2: return ["Your body is a heavy bulge, hanging five feet down the snake's gullet."];
        case 3: return ["Hot flesh squeezes all around you, grinding on your body as you're held perilously close to the anaconda's stomach."];
        case 4: return ["Unyielding flesh holds you tight against the entrance of the serpent's stomach. One last swallow and you're going in."]
      }
    } else if (this.flags.state == "stomach") {
      if (this.flags.stomach.depth <= 1) {
        return ["You're held up right against the entrance to the snake's sloppy gut."];
      } else if (this.flags.stomach.depth < 10) {
        return ["The rippling stomach squeezes on your slick, delicious body."];
      } else if (this.flags.stomach.depth < 20) {
        return ["You're trapped halway into the anaconda's crushing stomach."];
      } else if (this.flags.stomach.depth < 30) {
        return ["The anaconda's guts seem endless - rippling, churning, crushing."];
      } else {
        return ["You're so very deep..."];
      }
    } else {
      return [];
    }
  };

  let attacker = this;

  this.attacks = [];

  // hiss at player
  this.attacks.push({
    attackPlayer: function(defender) {
      return pickRandom([
        ["The anaconda raises its head and hisses"],
        ["The hulking serpent narrows its eyes and hisses at you"]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // slap player with tail
  this.attacks.push({
    attackPlayer: function(defender) {
      if (statHealthCheck(attacker, defender, "str")) {
        let damage = attack(attacker, defender, attacker.str/2);
        return ["The snake's tail whips around, smacking you for " + damage + " damage!"];
      } else {
        return ["The serpent's tail lashes at you, but you manage to stay out of its way."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // grab player with tail
  this.attacks.push({
    attackPlayer: function(defender) {
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "grapple";
        attacker.flags.tail.turns = 0;
        attacker.flags.tail.submits = 0;
        let damage = attack(attacker, defender, attacker.str/2);
        return ["The snake's tail whips around and grabs you! A tight embrace of smooth, cold scales grips your entire upper body, a lazy <i>clench</i> of muscle suppressing your meek struggles."];
      } else {
        return ["The anaconda tries to snatch you up in its tail. You dodge out of the way."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 4 - 4 * defender.healthPercentage(); }
  });

  // squeeze in tail
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.tail.turns++;
      let damage = attack(attacker, defender, attacker.str / 2 * attacker.flags.tail.turns);
      defender.changeStamina(attacker.str / 2 * attacker.flags.tail.turns);
      return pickRandom([
        ["Tight, crushing coils bear down..."],
        ["Stars fill your eyes as the snake crushes you alive."],
        ["You gasp silently, struggling for breath."],
        ["Your bones creak under the strain as the anaconda squeezes you like a toy."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.healthPercentage(); }
  });

  // swallow from tail
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "oral";
      attacker.flags.oral.depth = 1;
      return ["The snake's head swoops in close - and then its jaws split open. You struggle and strain against the beast's crushing scales, its gaping throat taking you in with terrifying ease...enveloping your head, shoulders, chest, hips, and legs in one smooth motion. It hefts its head up before throwing it up high, letting gravity drag you all the way down into its velvety throat. A hot, wet <i>glurrk</i> seals you away..."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 - defender.healthPercentage() + attacker.flags.tail.submits; }
  });

  // swallow player
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.oral.depth++;
      return pickRandom([
        ["A light swallow sucks you deeper."],
        ["You slip deeper still, tugged into the abyss by powerful muscle."],
        ["Powerful muscle pulls you down deep."],
        ["The snake swallows, tugging you deeper and deeper..."],
        ["<i>Glrp.</i> Down you go."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // squeeze
  this.attacks.push({
    attackPlayer: function(defender) {
      attack(attacker, defender, attacker.str/2);
      defender.changeStamina(-attacker.str/2);
      return pickRandom([
        ["Powerful, rippling walls clench around your imprisoned body, wearing your out."],
        ["The peristaltic pressure peaks as you're crushed and ground, squeezed and smothered in the anaconda's powerful gullet."],
        ["The pressure is immense, squeezing and grinding your body like a stick of gum being chewed."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.healthPercentage(); },
    gameover: function() { return "Crushed and digested by " + attacker.description("a"); }
  });

  // pull into stomach
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "stomach";
      attacker.flags.stomach.depth = 3;
      return ["The snake's throat clenches one last time, sucking you down into the beast's long, crushing stomach. You slide in a few feet, the entrance sealing shut behind you...sealing you away in that acidic pit."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      },
      function(attacker, defender) {
        return attacker.flags.oral.depth >= 4;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return defender.healthPercentage(); }
  });

  // digest
  this.attacks.push({
    attackPlayer: function(defender) {
      let damage = attacker.con / 5 + attacker.con / 20 * attacker.flags.stomach.depth;

      if (attacker.flags.stomach.depth >= 30) {
        damage *= 2;

      }
      attack(attacker, defender, damage);
      defender.changeStamina(-damage);
      attacker.stomachPull(Math.floor(Math.random()*4+4));
      if (attacker.flags.stomach.depth <= 10) {
        return pickRandom([
          ["Light pressure squeezes on your body."],
          ["The rippling walls clench around you."],
          ["Faint tingling dances across your skin."]
        ]);
      } else if (attacker.flags.stomach.depth <= 20) {
        return pickRandom([
          ["Thick, slimy chyme sloshes over your body."],
          ["The pressure is getting painful."],
          ["Powerful clenches of muscle bear down."],
          ["You struggle to breathe as the snake constricts you within."]
        ]);
      } else if (attacker.flags.stomach.depth < 30) {
        return pickRandom([
          ["The pressure is crushing you to death."],
          ["Agonizing acids sear your skin."],
          ["The snake hisses as it feels your body break."],
          ["You're melting and breaking in the snake's crushing stomach."],
          ["Trapped in the depths of the snake, you squirm and struggle as it melts you alive."]
        ]);
      } else {
        return pickRandom([
          ["You whimper with pain as the snake crushes you alive."],
          ["Crushing muscle grinds you against the end of the snake's gut."],
          ["You feel your body falling apart."],
          ["The rippling walls are too much to bear. You're going to melt..."]
        ]);
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.healthPercentage(); },
    gameover: function() { return "Digested alive by " + attacker.description("a"); }
  });


  /** PLAYER ATTACKS **/

  this.playerAttacks = [];

  // pass in combat
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Pass",
        desc: "Do nothing",
        attack: function(defender) {
          return ["You do nothing."];
        },
        requirements: [
          function(attacker, defender) {
            return defender.flags.state == "combat";
          }
        ]
      };
    }
  );

  // struggle in coils
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Struggle",
        desc: "Try to escape the coils!",
        attack: function(defender) {
          if (statHealthCheck(attacker, defender, "str")) {
            defender.flags.state = "combat";
            return ["You pry your way of the snake's coils!"];
          } else {
            return pickRandom([
              ["You struggle without effect."],
              ["Your struggles do nothing."],
              ["The snake's crushing coils hold you fast."]
            ]);
          }
        },
        requirements: [
          function(attacker, defender) {
            return defender.flags.state == "grapple";
          }
        ]
      };
    }
  );

  // pass in coils
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Submit",
        desc: "Do nothing",
        attack: function(defender) {
          defender.flags.tail.submits++;
          return ["You lie limp in the coils."];
        },
        requirements: [
          function(attacker, defender) {
            return defender.flags.state == "grapple";
          }
        ]
      };
    }
  );

  // struggle in throat
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Struggle",
        desc: "Try to escape the snake's gullet",
        attack: function(defender) {
          if (statHealthCheck(attacker, defender, "str")) {
            defender.flags.oral.depth--;
            if (defender.flags.oral.depth < 0) {
              defender.flags.state = "oral";
              return ["With a tremendous burst of strength, you force yourself into the snake's maw! It hisses and retches, spewing you out onto the forest floor."];
            } else {
              return ["You claw your way up the snake's throat"];
            }
          } else {
            return ["You struggle...and get nowhere."];
          }
        },
        requirements: [
          function(attacker, defender) {
            return defender.flags.state == "oral";
          }
        ]
      };
    }
  );

  // pass in throat
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Submit",
        desc: "Do nothing",
        attack: function(defender) {
          defender.flags.oral.depth++;
          return ["You let the snake's throat claim you..."];
        },
        requirements: [
          function(attacker, defender) {
            return defender.flags.state == "oral";
          }
        ]
      };
    }
  );

  // struggle in stomach
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Struggle",
        desc: "Try to struggle free!",
        attack: function(defender) {
          if (statHealthCheck(attacker, defender, "str") ||
          statHealthCheck(attacker, defender, "str")) {
            let distance = attacker.str / 10 + Math.floor(Math.random() * +attacker.str / 10);
            defender.stomachPull(-distance);

            if (defender.flags.stomach.depth <= 0) {
              if (statHealthCheck(attacker, defender, "str")) {
                defender.flags.state = "oral";
                defender.flags.oral.depth = 3;
                return ["You shove yourself into the entrance to the snake's wretched stomach - and break through! You slide back into its throat."];
              } else {
                return ["You shove yourself into the entrance to the snake's wretched stomach - and get stuck. The tight of ring of muscle is unyielding."];
              }
            } else {
              return ["You drag yourself " + distance + " feet forward, still imprisoned within the snake's bubbling gut."];
            }
          } else {
            return ["Your thrashes and squirms elicit a low hiss from the snake."];
          }
        },
        requirements: [
          function(attacker, defender) {
            return defender.flags.state == "stomach";
          }
        ]
      };
    }
  );

  // pass in stomach
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Rest",
        desc: "Rest and recover stamina",
        attack: function(defender) {
          attacker.changeStamina(attacker.maxStamina / 5);
          return ["You rest in the snake's squeezing stomach."];
        },
        requirements: [
          function(attacker, defender) {
            return defender.flags.state == "stomach";
          }
        ]
      };
    }
  );
  
  this.playerAttacks.push(
    function(attacker) {
      return {
        name: "Flee",
        desc: "Try to run away",
        attack: function(defender) {
          let success = statCheck(attacker, defender, "dex");
          if (success) {
            attacker.changeStamina(-25);
            attacker.clear();
            changeMode("explore");
            return ["You successfully run away."];
          } else {
            attacker.changeStamina(-25);
            defender.changeStamina(-25);
            return ["You can't escape!"];
          }
        },
        requirements: [
          function(attacker, defender) { return defender.flags.state == "combat"; }
        ]
      }
  });
}
