function MountainExplore() {
  GameObject.call(this, "Explore");

  this.actions.push({
    "name": "Wander around",
    "action": function() {
      startCombat(new MountainWyrm());
    }
  });

  this.actions.push({
    "name": "Enter the cave",
    "action": function() {
      startCombat(new MountainWyvern());
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

  this.attacks.push(wyrmWrestle(this));
  this.attacks.push(wyrmPounceBite(this));
  this.attacks.push(wyrmGrind(this));
  this.attacks.push(wyrmOralVore(this));
  this.attacks.push(wyrmCockVore(this));

  this.attacks.push(wyrmOralSwallow(this));

  this.attacks.push(wyrmStomachDigest(this));

  this.attacks.push(wyrmCockSwallow(this));
  this.attacks.push(wyrmCockCrush(this));
  this.attacks.push(wyrmCockIngest(this));

  this.attacks.push(wyrmBallsDigest(this));

  this.playerAttacks = [];

  this.playerAttacks.push(punchAttack);
  this.playerAttacks.push(flankAttack);

  this.playerAttacks.push(wyrmOralStruggle);
  this.playerAttacks.push(wyrmStomachStruggle);
  this.playerAttacks.push(wyrmCockStruggle);
  this.playerAttacks.push(wyrmBallStruggle);

  this.playerAttacks.push(pass);
  this.playerAttacks.push(flee);

  this.flags.cockTurns = 0;

  this.startCombat = function(player) {
    return ["A shadow falls over you; a heartbeat later, a hound-sized wyrm swoops down, landing with a heavy <i>thump</i> on the rocky ground. He hisses and snarls at you, rearing up in an attempt to intimidate you..and showing off his throbbing shaft."];
  };

  this.finishCombat = function() {
    if (this.flags.state == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.state == "grapple")
      return ["You black out, unable to maintain consciousness..."];
    else if (this.flags.state == "stomach")
      return [
        "You give one last heave - one last bid to escape - and fail utterly, falling limp in the wyvern's powerful stomach. He lets our a triumphant roar before settling in, letting out your last breath as part of a sharp, crass <i>BELCH</i>. He growls and moans lowly, rocking to and fro as your body falls apart like slow-cooked meat.",
        newline,
        "He stirs after a long half-hour, cock throbbing and twitching with pent-up pleasure. Your body is gone, now little more than bubbling chyme...save for a rather conspicuous bulge in his gut. He clenches his belly hard, shoving it from his stomach and into that draconic throat. It rises up, buoyed by a surging, gurgling eruption of gas...and then, as a final insult to your obliterated life, the wyvern belches out your skull and a dozen-or-so bones. On it drags for a solid second, and in the joy of the moment, his ecstasy tips over the edge, lashing the ground with thick ropes of his sticky, potent seed. The sheer power of the release echoes off distant mountains as the half-digested bones clatter down a steep cliff, coming to rest amongst a heap of former adventurers...just another addition to the ever-growing pile. Oh well."
      ];
    else if (this.flags.state == "cock" || this.flags.state == "balls") {
      let lines = [];
      if (this.flags.state == "cock") {
        lines = ["You expire in the dragon's shaft, crushed to death by the wyrm's lust. The greedy cock sucks you down deep, plunging you into a tight prison of cum-drenched flesh."];
      } else {
        lines = ["The wyrm's thick, clingy cum proves too much for your body to bear. Slowly, surely, your struggles begin to fade - melting muscles dwindling your strength away to nothing. Deep, satisfied growls reverberate through your captor's massive seed-soaked prison...the last thing you perceive before everything goes dark."];
      }
      return lines.concat([
        newline,
        "Your body takes several hours to melt, breaking down and dissolving into a lake of hot, churning cum. The weight is enough to pin the greedy beast to the ground, and there he lays - panting, groaning, already forgetting the struggle he made to consume you and digest you alive. All the beast cared about now was chasing that <i>release.</i>",
        newline,
        "Dwarfed as he is by the sheer size of his own orbs, the dragon begins to thrust. He rocks back and forth, bracing himself against a jagged outcropping of rock to press down into his glorping, gurgling balls. Powerful <i>gllrrrrps</i> are punctuated by staccato bursts of <i>blorps</i> and <i>pops</i> of bubbling, frothing cum.",
        newline,
        "The bubble-churn of flesh and bone becoming seed begins to taper off, and the scaly predator lets out a triumphant roar. He shifts onto his back, curling up to raise his snout to the tip of his foot-long shaft. Draconic jaws part and a slick tongue slithers out...and he begins to lick. Every stroke of wet muscle sends a jolt of ecstasy up his spine. All too eager to release its pent-up flood, his cock throbs and twitches, engoring with blood and spurting out gobs of precum with each quick, forceful <i>slurp</i>. The tempest of gurgling cum is punctuated by the <i>shlllk-shlllk</i> of lust-lubricated flesh, his hindpaws straining to squeeze on his turgid cock to stimulate it just a <i>little more</i>. His lust builds for a half-minute, and then...",
        newline,
        "The first shot of cum arcs through the air. A gallon of rich, clingy wyrm seed splatters against a cliff face, raining down on the dusty ground. The next lands squarely in the wyrm's jaws, gushing down his throat and stuffing his belly with what was once <i>you</i>...and coating the rest of his body, too. He roars and thrashes, every orgasmic clench of muscle spraying pint after pint of his cum. The display drags on for an entire minute, slowly reducing in intensity - and then comes the finale, as a bulge rushes up his cock and erupts into the world. Your skull rockets from that perilously predatory cock, bouncing off the wall and clattering to the ground amidst an ankle-deep pool of cum."
      ]);
    }
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
      return 2.5 - 1.25 * defender.healthPercentage();
    }
  };
}

function wyrmWrestle(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str / 3);
      attacker.changeStamina(-15);
      defender.changeStamina(-35);
      return ["The wyrm grabs you and thrashes you about, trying to tire you out."];
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

function wyrmPounceBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str / 3);
      attacker.changeStamina(-15);
      defender.changeStamina(-25);
      return ["The wyrm snaps at you, biting your shoulder."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage() * defender.prefs.vore.oral; }
  };
}

function wyrmGrind(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str / 3);
      attacker.changeStamina(-15);
      defender.changeStamina(-35);
      return ["You squirm as the wyrm grinds his throbbing red shaft along your body, painting your chest and face with hot, musky fluids."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage() * defender.prefs.vore.cock; }
  };
}

function wyrmOralVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "oral";
        attacker.flags.oralDepth = 1;
        defender.changeStamina(-25);
        return ["Gasping for breath, you can only watch as the wyrm's jaws splay wide - strands of drool lashing out like bolts of lightning - and force over your head."];
      } else {
        return ["The wyrm's jaws splay wide, lunging in and trying to wrap around your head, but you manage to punch the beast in the snout and force him to back off."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.oral > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) {return (1 - 0.5 * defender.staminaPercentage()) * defender.prefs.vore.oral; }
  };
}

function wyrmOralSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.oralDepth += 1;
      if (attacker.flags.oralDepth == 4) {
        attacker.flags.state = "stomach";
        return ["The beast gulps one last time, pulling your whole body into his roiling guts."];
      } else if (attacker.flags.oralDepth == 3) {
        return ["Hot, slimy flesh smothers your legs as they're dragged down. Trapped and teased, smothered and squeezed - you're one swallow away from being sealed away for good."];
      } else if (attacker.flags.oralDepth == 2) {
        return ["A powerful swallow claims your belly and hips. Your head pops into the wyrm's burning-hot belly, shoved into the slimy, fleshy prison with ease."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
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
    weight: function(attacker, defender) { return (2 - defender.staminaPercentage()) * defender.prefs.vore.cock; }
  };
}

function wyrmCockSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.cockDepth += 1;
      attacker.flags.cockTurns += 1;
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

function wyrmCockSqueeze(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, 5 * attacker.flags.cockDepth);

      return ["The rock-hard shaft squeezes in on you."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Crushed to death in the cock of " + attacker.description("a"); }
  };
}

function wyrmCockIngest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.cockDepth = 5;
      attacker.flags.state = "balls";
      return ["Exhausted and weak, you can do little to resist as a long, smooth swallow sucks you all the way into the wyrm's swollen balls."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return defender.health <= 0 || defender.stamina <= 0;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyrmCockCrush(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, 100 * attacker.flags.cockDepth);

      return ["The wyrm's cock throbs and clenches, crushing the life from your body!"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return attacker.flags.cockTurns >= 10;
      }
    ],
    priority: 3,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Crushed to death in the cock of " + attacker.description("a"); }
  };
}

function wyrmStomachDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 25);
      return pickRandom([
        ["The wyrm's swollen gut gurgles, swiftly melting you down."],
        ["Powerful muscles grind and squeeze, trying to crush you alive."],
        ["The tight confines pulse and throb, clenching tighter with every passing second."],
        ["Tingling acid and intense heat swiftly wear you down."],
        ["You can barely move, imprisoned in shrink-wrap-tight flesh and doused in acid."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Digested in the stomach of " + attacker.description("a"); }
  };
}

function wyrmBallsDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 50);
      return pickRandom([
        ["The wyrm's overstuffed balls churn, swiftly melting you down into dragon seed."],
        ["Hot, musky cum bathes your softening skin. You're going to melt if you don't escape soon!"],
        ["Your world rocks and churns as the wyrm thrusts against your melting body."],
        ["Powerful pressure squeezes in on your body, smearing thick cum over your swiftly-digesting self."]
      ]);
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

function wyrmOralStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to escape the wyrm's throat!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.oralDepth -= 1;
        if (defender.flags.oralDepth == 2) {
          return ["You grunt and shove, forcing your legs out of the beast's jaws."];
        } else if (defender.flags.oralDepth == 1) {
          return ["Your struggles bear fruit, pushing your hips and belly out into the cool mountain air."];
        } else if (defender.flags.oralDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to escape! Your eyes struggle to focus as your head slides from the wyrm's gullet, leaving you vulnerable for a moment - but the beast is no metter off than you, hacking and coughing as you rise to your feet."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "oral"; }
    ],
    priority: 1,
  };
}

function wyrmStomachStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyrm's guts!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "oral";
        defender.flags.oralDepth = 2;
        return ["You struggle and squirm, forcing yourself back into the wyrm's hot throat. He's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but it's of no use."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "stomach"; }
    ],
    priority: 1,
  };
}


function wyrmCockStruggle(attacker) {
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

function wyrmBallStruggle(attacker) {
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

function MountainWyvern() {
  Creature.call(this, "Wyvern", 25, 15, 35);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " wyvern"; };

  this.attacks = [];

  this.flags.state = "combat";
  this.flags.roars = 0;

  this.flags.cockDepth = 0;

  this.attacks.push(wyvernBite(this));
  this.attacks.push(wyvernTail(this));
  this.attacks.push(wyvernRoar(this));

  this.attacks.push(wyvernPounce(this));

  this.attacks.push(wyvernOralVore(this));
  this.attacks.push(wyvernUnbirth(this));
  this.attacks.push(wyvernBreastVore(this));

  this.attacks.push(wyvernOralSwallow(this));

  this.attacks.push(wyvernStomachDigest(this));

  this.attacks.push(wyvernBreastSwallow(this));
  this.attacks.push(wyvernBreastIngest(this));

  this.attacks.push(wyvernUnbirthSwallow(this));
  this.attacks.push(wyvernUnbirthCrush(this));

  this.attacks.push(wyvernWombDigest(this));

  this.playerAttacks = [];

  this.playerAttacks.push(punchAttack);
  this.playerAttacks.push(flankAttack);

  this.playerAttacks.push(wyvernOralStruggle);
  this.playerAttacks.push(wyvernStomachStruggle);
  this.playerAttacks.push(wyvernUnbirthStruggle);
  this.playerAttacks.push(wyvernWombStruggle);
  this.playerAttacks.push(wyvernBreastStruggle);

  this.playerAttacks.push(pass);
  this.playerAttacks.push(flee);

  this.startCombat = function(player) {
    return ["Your exploration is abruptly interrupted as you stumble into the lair of a female wyvern. She hisses and rears up, glistening slit framed by her scaly underbelly above and - most surprisingly - a pair of modestly-sized breasts below. Some reptiles these are..."];
  };

  this.finishCombat = function() {
    if (this.flags.state == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.state == "unbirth" || this.flags.state == "womb") {
      let result = [];
      if (this.flags.state == "unbirth")
        result.push("You expire in the dragon's cooch, crushed to death by the wyvern's lust. A long, lustful wave of quivering muscle sucks you into her innermost depths - her hot, dripping womb - and, soon after, your body dissolves.");
      else if (this.flags.state == "womb")
        result.push("You expire in the dragon's womb, crushed in a vice-grip of muscle and slowly dissolved by her juices. Your thrashing, shrink-wrap-tight bulge has ceased to move, and over the course of a half-hour, it loses its shape...melting down to a nice, heavy heap of femcum.");
      result.push(newline);

      result.push("The wyverness stirs, gradually easing herself over towards the cave's wall - struggling to move under the weight of your former body. She pants and moans, tail swishing from side to side before abruptly curling in and stabbing at her oozing, glistening slit. The dull-pointed tip plunges in perfectly, sending a shock of pleasure up her spine and eliciting a strong, deep <i>growl</i> of delight.",
      newline,
      "Thick, churning glorps rock her overstuffed womb. Every twitch, every quiver, every squeeze - each and every one elicits a storm of <i>schlrrrorps</i> and <i>shllllks</i> as your molten body is sloshed about in fatal, maternal depths.",
      newline,
      "Her efforts grow more forceful as her already-powerful lust builds and builds. Moans and gasps echo off the hard, craggy walls. The wyverness' tail sinks deeper and deeper, breaching into her womb and letting out splatters of hot, sticky femcum. Your remains spray out in fist-sized globs, hitting the wall behind her and flowing down to the ground. The churning is deafening now - her depths are a tempest, full of sloshing nectar and frothing fluid.",
      newline,
      "Then comes the orgasm.",
      newline,
      "An earsplitting roar of pleasure bursts from her jaws as the floodgates open. A flock of birds outside startles and takes flight; the walls themselves seem to shake for a brief moment. The wyverness' nethers twitch, spasm, and open wide, expelling a firehose torrent of her slick nectar. The force shoves her hips to the floor, spraying the wall, ceiling, and floor in an unstoppable display of lust.",
      newline,
      "She rolls onto her side as her lower belly shrinks down to around her size, then onto her stomach - thrusting and humping, shooting out powerful spurts of femcum that lash back fifteen feet, if not more. Utter euphoria wracks her entire body, and as the final spasms squeeze out the last gallons that were once your tender, delicious frame, a final shot of sheer euphoria strikes her: out comes your skull, its softened edges grinding against her depths and her folds in <i>just</i> the right way. She passes out, tongue lolling out and eyes half-lidded amongst an oozing pool of nectar...and your life is truly spent.");

      return result;
    }
    else if (this.flags.state == "breasts")
      return [
        "You let out a final gasp, air trickling from your mouth and bubbling up through the rich dragon-milk. Your instincts force you to breathe, and you suck in a lungful of the creamy fluid...and then, you black out, struggles slowly coming to a stop in that massively overfilled breast.",
        newline,
        "The wyverness moans with pleasure, rocking softly from side to side as her breast begins to properly break you down. What was once a subtle sloshing has become incredibly loud, her cream beginning to bubble and froth as it works to turn <i>you</i> into more of it. Panting and huffing and churring nice and lowly, the beast drifts off into a brief slumber.",
        newline,
        "The churning grows ever-stronger as she sleeps. Thick, wet <i>blorps</i> rock the cave as the stretchy breast clenches in on your fading body, grinding enzymes into your flesh and breaking it down like soaked tissue paper. <i>Shlrrrp-glrrrpkh</i> - and now it's even tighter. So intense is her digestion that it sounds of boiling, with a low, bubbling roar occasionally interrupted by a sloppy slosh of another hunk of your body falling apart and melting away.",
        newline,
        "An hour later, the wyverness stirs. She moans and stretches, lazily rolling onto her side - making a soft <i>splash</i> as she disturbs a puddle of leaked-out milk. Her eyes widen at the sight of her massive breast, which still easily dwarfs her own body...and she lets out a victorious roar. Your identity - whatever <i>you</i> were - is long gone from her mind; all she knows now is how very <i>full</i> she is.",
        newline,
        "And then, she gets to work. She scoots herself towards the wall, every move forcing out a half-cup of fatty milk and smearing it across the floor. A long minute later, she gets close enough to lift herself up with her forepaws...and then drop back down. The impact opens her up like a breached dam, forcing out a powerful jet of milk that sprays across the wall, splattering the floor all around her in the warm fluid. She roars and moans, gasping for breath and panting and thrusting and reveling in the sheer ecstasy of her dominance over...well, whatever it was she'd melted down.",
        newline,
        "Now halfway empty, she curls up and gets her forepaws around her huge breast. A few strong squeezes get her flowing again, now lashing the fifteen-foot ceiling with pulses of milk. She rolls and thrashes and soaks herself in the fluid, licking up a little...and letting the rest flow away. It flows from the cave and seeps into the gritty earth beyond, your wasted life soaking into the earth as she soaks in the afterglow."
      ];
    else if (this.flags.state == "stomach")
      return [
        "You give one last heave - one last bid to escape - and fail utterly, slumping down and falling unconscious in the boiling guts of the predatory wyverness. She sighs and groans as your body succumbs to her searing acids, crushed and smothered as a cacophony of <i>bloorshes</i> and <i>grrrrrrrllks</i> fill the cave with the sound of your wretched demise.",
        newline,
        "She falls asleep for a short while, perched atop her own belly...eventually awakening as her snout brushes the floor, your liquefied remains draining from her acrid stomach at a slow, steady pace. One lump remains, though, and as she lets out a lazy <i>yaaaaawn</i>, it begins to shift. She saunters toward the cave's mouth, pressing down on her gut and twitching a few times...and then, with a great heave, horking up your skull. It erupts from her jaws - pitted by acid and cracked down the middle - and bounces off a wall, clattering down a sheer cliff face and joining a heap of well-weathered bones far below..."
      ];
  };
}

function wyvernBite(attacker) {
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

function wyvernTail(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.dex);
      return [attacker.description("The") + " lashes at you with her tail, dealing " + damage + " damage."];
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

function wyvernRoar(attacker) {
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

function wyvernPounce(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "dex")) {
        attacker.flags.state = "grapple";
        defender.flags.grappled = true;
        return ["The wyverness leaps forward, slamming into you and pinning you against the cave wall! You slide down to the floor as she roars in your face, snapping fangs splattering your snout with drool."];
      } else {
        return ["The wyverness pounces, hurtling towards you like a stone from a sling. You raise your arms in time to block; the impact knocks you to the floor, but you manage to throw her off in the process."];
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

function wyvernOralVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "oral";
        attacker.flags.oralDepth = 1;
        defender.changeStamina(-25);
        return ["Gasping for breath, you can only watch as the wyvern's jaws splay wide - strands of drool lashing out like bolts of lightning - and force over your head."];
      } else {
        return ["The wyvern's jaws splay wide, lunging in and trying to wrap around your head, but you manage to punch the beast in the snout and force him to back off."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.oral > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) {return (1 - 0.5 * defender.staminaPercentage()) * defender.prefs.vore.oral; }
  };
}

function wyvernOralSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.oralDepth += 1;
      if (attacker.flags.oralDepth == 4) {
        attacker.flags.state = "stomach";
        return ["The greedy wyvern swallows hard, cramming your entire body into her overstuffed belly."];
      } else if (attacker.flags.oralDepth == 3) {
        return ["Deep growls thrum in the wyvern's throat as she takes in your legs."];
      } else if (attacker.flags.oralDepth == 2) {
        return ["Pulsing muscle drags you deeper, sucking your hips into the wyvern's throat as your upper body slides into her stomach."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyvernUnbirth(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "unbirth";
        attacker.flags.unbirthDepth = 1;
        defender.changeStamina(-25);
        return ["A lustful thrust from the wyvern shoves her hips down over your face. You gasp as it makes impact...and takes you in, shoving your head into her powerful snatch."];
      } else {
        return ["The wyvern growls and shoves her hips against your snout. Her glistening slit smears over your snout, glazing you in her juices."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.unbirth > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return (2 - defender.staminaPercentage()) * defender.prefs.vore.unbirth; }
  };
}

function wyvernUnbirthSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.unbirthDepth += 1;
      if (attacker.flags.unbirthDepth == 5) {
        attacker.flags.state = "womb";
        attacker.flags.wombTurns = 0;
        return ["A drawn-out yowl of pleasure reaches your ears - you've been entirely consumed, stuffed into a hot, musky womb and drenched in digestive juices. You'd better escape soon..."];
      } else if (attacker.flags.unbirthDepth == 4) {
        return ["Muscular walls drag you deeper still. Your're nearly gone from the world."];
      } else if (attacker.flags.unbirthDepth == 3) {
        return ["The wyvern's cervix spreads around your belly, your legs left hanging from the overstuffed beast's nethers."];
      } else if (attacker.flags.unbirthDepth == 2) {
        return ["Deeper you slip, shoulders gliding into the wyvern's maternal prison."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "unbirth";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyvernUnbirthCrush(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.str * attacker.flags.unbirthDepth);

      return ["The wyvern's cooch throbs and clenches, crushing the life from your body!"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "unbirth";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.13; },
    gameover: function() { return "Crushed to death in the cooch of " + attacker.description("a"); }
  };
}

function wyvernStomachDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 50);
      return pickRandom([
        ["The wyvern's gut clenches hard, churning and crushing you with ease."],
        ["Thick walls of muscle clench in slow, rolling waves of peristalsis - each one tighter than the last."],
        ["Throbbing pressure bears down on you, mashing chyme into your skin and softening you up."],
        ["Powerful acids douse you like rainwater in a storm, stinging and stewing you at a frightening pace."],
        ["You can barely move in the wyverness' tight guts - and if you don't escape soon, you'll never move again."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Digested in the stomach of " + attacker.description("a"); }
  };
}

function wyvernWombDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.wombTurns += 1;
      attack(attacker, defender, 20 * attacker.flags.wombTurns);
      switch(attacker.flags.wombTurns) {
        case 1: return ["The wyverness' womb clenches lightly, kneading over your imprisoned form."];
        case 2: return ["The pressure is stronger now - squeezing, kneading, crushing."];
        case 3: return ["Your body is starting to turn soft...soaked and slathered in the wyverness' nectar."];
        case 4: return ["The heat is becoming unbearable. Everything is tight, wet, and crushing."];
        case 5: return ["Incredibly force clamps down on your body. She wants you <i>now.</i>"];
        default: return pickRandom([
          ["Your body is dissolving into the wyverness' juices."],
          ["The crushing pressure is overwhelming."],
          ["You're feeling truly trapped...unable to move, unable to think."]
        ]);
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "womb";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Melted down to femcum and sprayed out by " + attacker.description("a"); }
  };
}

function wyvernBreastVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "breasts";
        attacker.flags.breastDepth = 1;
        defender.changeStamina(-25);
        return ["The wyvern grinds her heavy breasts over your pinned body...and a nipple spreads around your head like a rubber band."];
      } else {
        return ["The lustful wyvern forces her breasts into your face, smearing your snout in milk and marking you in faint musky scents."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.breast > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return (2 - defender.staminaPercentage()) * defender.prefs.vore.breast; }
  };
}

function wyvernBreastSwallow(attacker) {
  return {
    attackPlayer: function(defender) {

      attack(attacker, defender, attacker.con / 4 * attacker.flags.breastDepth);

      attacker.flags.breastDepth += 1;
      if (attacker.flags.breastDepth >= 6) {
        return ["Lost entirely within overstuffed breast, you can only whimper and squirm as it melts you down to creamy milk."];
      } else if (attacker.flags.breastDepth == 5) {
        return ["You're so very deep - and so very close to your demise. You cough and gag, choking on the wyvern's milk as she moans and splays out on the cave floor, leaking the creamy fluid and thrashing with pleasure."];
      } else if (attacker.flags.breastDepth == 4) {
        return ["Your ankles slip inside the wyvern's breast - she has you now. Your thrashes do little to dissuade her from taking you deeper still."];
      } else if (attacker.flags.breastDepth == 3) {
        return ["You're almost gone from the world, legs dangling from the wyvern's incredibly engorged breast. It stretches seemingly without limit as you're dragged in..."];
      } else if (attacker.flags.breastDepth == 2) {
        return ["<i>Shlllrrp-GLRK.</i> A powerful clench sucks in your entire torso, forcing a spurt of milk through your gritted teeth as your predator's breast swells to incredible size!"];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "breasts";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Melted down to milk and squeezed out by " + attacker.description("a"); }
  };
}

function wyvernBreastIngest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.breastDepth = 5;
      return ["Your strength has dwindled, and the wyvern knows. She moans and clenches, sucking you all the way into her milky breasts."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "breasts";
      },
      function(attacker, defender) {
        return defender.health <= attacker.str / 4 * attacker.flags.breastDepth;
      },
      function(attacker, defender) {
        return attacker.flags.breastDepth < 5;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyvernOralStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to escape the wyvern's throat!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.oralDepth -= 1;
        if (defender.flags.oralDepth == 2) {
          return ["You grunt and shove, forcing your legs out of the beast's jaws."];
        } else if (defender.flags.oralDepth == 1) {
          return ["Your struggles bear fruit, pushing your hips and belly out into the cool mountain air."];
        } else if (defender.flags.oralDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to escape! Your eyes struggle to focus as your head slides from the wyvern's gullet, leaving you vulnerable for a moment - but the beast is no metter off than you, hacking and coughing as you rise to your feet."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "oral"; }
    ],
    priority: 1,
  };
}

function wyvernStomachStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyvern's guts!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "oral";
        defender.flags.oralDepth = 2;
        return ["You struggle and squirm, forcing yourself back into the wyvern's hot throat. He's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but it's of no use."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "stomach"; }
    ],
    priority: 1,
  };
}

function wyvernUnbirthStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to pull yourself from the wyvern's cooch!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.unbirthDepth -= 1;
        if (defender.flags.unbirthDepth == 3) {
          return ["Your struggles pull you back from the very brink of doom...but you're still mostly within the wyvern, and still so very close to becoming hers."];
        } else if (defender.flags.unbirthDepth == 2) {
          return ["You push back, surging with vigor (and a desire to not become an orgasm). Your hips pops out from the wyvern's snatch!"];
        } else if (defender.flags.unbirthDepth == 1) {
          return ["You grit your teeth and pry yourself from those perilous depths, freeing all but your head."];
        } else if (defender.flags.unbirthDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to free yourself! Soaked in femjuice and dazed by the wyvern's constricting snatch, certainly, but very much alive.",newline,"For now."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "unbirth"; }
    ],
    priority: 1,
  };
}

function wyvernWombStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyvern's womb!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "unbirth";
        defender.flags.unbirthDepth = 3;
        return ["You struggle and squirm, forcing yourself back into the wyvern's throbbing snatch. She's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but to no avail."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "womb"; },
      function(attcker, defender) { return defender.flags.wombTurns <= 5; }
    ],
    priority: 1,
  };
}

function wyvernBreastStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to pull yourself from the wyvern's breast!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.breastDepth -= 1;
        if (defender.flags.breastDepth == 4) {
          return ["Your struggle just enough to escape death, still utterly lost in the wyvern's sloshing breast."];
        } else if (defender.flags.breastDepth == 3) {
          return ["Your struggles bear fruit - your legs slip free, and you don't feel quite as...<i>doomed</i>."];
        } else if (defender.flags.breastDepth == 2) {
          return ["With a great heave, you shove your hips free. The wyvern's nipple clenches hard around your belly, holding you fast."];
        } else if (defender.flags.breastDepth == 1) {
          return ["Pushing blindly against slick, hot walls, you gradually extract your torso from the engorged beast's breast."];
        } else if (defender.flags.breastDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["With a splatter of milk and a low gasp from the wyvern, you break free! You fall to the ground, panting and gasping as you struggle back to your feet."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "breasts"; },
      function(attacker, defender) { return defender.flags.breastDepth < 6; }
    ],
    priority: 1,
  };
}
