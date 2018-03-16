/* AEZNON GETA COMMISSION */

function Geta() {
  Creature.call(this, "Geta", 5, 15, 10);

  this.hasName = true;

  this.description = function() { return "Geta"; };

  this.attacks.push(new punchAttack(this));
  this.attacks.push(new getaShrink(this));
  this.attacks.push(new getaGrab(this));
  this.attacks.push(new getaTease(this));
  this.attacks.push(new getaSuckle(this));
  this.attacks.push(new getaSalivaSwallow(this));
  this.attacks.push(new getaSwallow(this));

  this.attacks.push(new getaStomp(this));
  this.attacks.push(new getaStompFinish(this));

  this.backupAttack = new pass(this);

  this.digests = [];

  this.digests.push(new digestPlayerStomach(this,50));
  this.struggles = [];

  this.struggles.push(new rub(this));

  this.prefs.scat = false;
  this.prefs.analVore = false;
}

function getaShrink(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5;

      if (success) {
        defender.flags.shrunk = true;
        return [attacker.description() + " pulls a strange device from his pocket and points it at you. A blinding flash envelops your vision...and as your sight returns, you find yourself shrunken down to no more than two inches tall."];
      } else {
        attacker.flags.shrunk = true;
        return [attacker.description() + " pulls a strange device from his pocket and points it at you. A blinding flash envelops your vision...and as your sight returns, you see that he's shrunk himself!"];
      }
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isNormal(defender);
      }
    ],
    priority: 2
  };
}

function getaGrab(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.flags.grappled = true;
      return [attacker.description() + " leans down and snatches you up, stuffing you into his maw."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled != true;
      },
    ],
    priority: 2
  };
}

function getaTease(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.stamina = Math.max(defender.stamina - 25, 0);
      return [attacker.description() + " grinds you against the roof of his maw with his tongue."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina > 0;
      }
    ],
    priority: 1
  };
}

function getaSuckle(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.stamina = Math.max(defender.stamina - 45, 0);
      return [attacker.description() + " shuts his jaws and suckles on you."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina > 0;
      }
    ],
    priority: 1
  };
}

function getaSalivaSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.stamina = Math.max(defender.stamina - 15, 0);
      return [attacker.description() + " swallows, draining the drool from his jaws - leaving you on the precipice of his gullet."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina > 0;
      }
    ],
    priority: 1
  };
}

function getaSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      changeMode("eaten");
      return [attacker.description() + " shuts his jaws and swallows, dragging you down into his tight throat and dumping you into a caustic stomach."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina <= 0;
      }
    ],
    priority: 2
  };
}

function getaStomp(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statCheck(attacker, defender, "dex") || statCheck(attacker, defender, "dex") || defender.stamina == 0;
      if (success) {
        defender.health = Math.max(-100, defender.health - 50 - Math.round(Math.random() * 25));
        defender.stamina = 0;
        return [attacker.description() + "'s paw comes crashing down on your little body, smashing you into the dirt."];
      } else {
        return ["You dive away as " + attacker.description() + "'s paw slams down, narrowly missing your little body."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled != true;
      }
    ],
    priority: 2,
  };
}

function getaStompFinish(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.health = -100;
      return [attacker.description() + " looms over your stunned body. You can only watch as his toes flex, squeeze...and come down hard. The fox's paw crushes you like an insect, tearing you open and spilling your guts across the dusty trail. He grinds you a few times more for good measure, leaving a disfigured, broken mess in your place."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled != true;
      },
      function(attacker, defender) {
        return defender.stamina <= 0;
      }
    ],
    conditions: [
      function(attacker, defender) {
        return defender.prefs.gore;
      }
    ],
    priority: 3,
  };
}

function GetaObj() {
  GameObject.call(this, "Geta");
  this.actions.push( {
    "name": "Approach Geta",
    "action": function() {
      startDialog(new GetaDialog());
    }
  });
}

function GetaDialog() {
  DialogNode.call(this);

  this.text = ["You approach the sandy-furred fox."];

  {
    let nodeFight = new DialogNode();
    this.addChoice("He certainly looks tasty...", nodeFight);

    nodeFight.text = ["You stalk up to your prey, but he sees you coming. You're going to have to fight!"];
    nodeFight.hooks.push( function(){
      currentFoe = new Geta();
      changeMode("combat");
    });
  }

  {
    let nodeIgnore = new DialogNode();
    this.addChoice("Leave him be", nodeIgnore);
  }
}

/* TRANCE */

function Trance() {
  Creature.call(this, "Trance", 25, 20, 25);

  this.hasName = true;

  this.description = function() { return "Trance"; };

  this.attacks.push(new punchAttack(this));
  this.attacks.push(new tranceKick(this));
  this.attacks.push(new tranceStomp(this));

  this.attacks.push(new tranceGrapple(this));
  this.attacks.push(new tranceGrappleDevour(this));
  this.attacks.push(new grappleSubdue(this));
  this.attacks.push(new tranceGrappleMaul(this));
  this.attacks.push(new tranceGrappleThroat(this));

  this.attacks.push(new grappledReverse(this));
  this.attacks.push(new grappledDevour(this));

  this.backupAttack = new pass(this);

  this.digests = [];

  this.digests.push(new tranceDigest(this,50));
  this.digests.push(new tranceDigestCrush(this,75));
  this.digests.push(new tranceDigestInstakill(this,75));

  this.struggles = [];

  this.struggles.push(new struggleStay(this));
  this.struggles.push(submit(this));

  this.startCombat = function() { return ["You yelp and turn around as hot breath spills over your shoulder. A massive sergal has crept up on you...and he looks <i>hungry</i>"]; };
  this.finishDigest = function() { return ["The sergal's crushing guts reduce you to a pool of chyme..."]; };
  this.defeated = function() { changeMode("explore"); update(["The sergal winces and stumbles, grabbing a thick branch to steady himself...and snapping it in half like a twig. You decide discretion is the better part of valor and run while you can."]); };
  this.prefs.prey = false;
}

function tranceKick(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-25);
      defender.changeStamina(-50);
      return [attacker.description("The") + " leaps at you, lashing out with sharp-clawed paws and goring you for " + attack(attacker, defender, attacker.str * 3) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.gore; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.5 * defender.health / defender.maxHealth; }
  };
}

function tranceGrapple(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        defender.flags.grappled = true;
        return [attacker.description("The") + " lunges at you, pinning you to the floor!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return [attacker.description("The") + " tries to tackle you, but you deftly avoid them."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function tranceStomp(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-100);
      let result = [attacker.description("The") + " shoves you to the ground, planting one foot on your chest and crushing your head beneath the other, crippling you and dealing " + attack(attacker, defender, attacker.str * 5) + " damage"];
      if (defender.health <= 0) {
        result[0] += ". Your skull breaks open as his crushing weight snuffs you out like a candle, smearing your brain across the ground and splitting your jaw in half. <i>Ouch.</i>";
        defender.health = -100;
      }
      return result;
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.gore; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return attacker.health / attacker.maxHealth > 0.5 ? 0 : 3; },
    gameover: function() { return "Crushed under Trance's paw"; }
  };
}

function tranceGrappleDevour(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = false;
        changeMode("eaten");
        return [attacker.description("The") + " forces your head into their sloppy jaws, devouring you despite your frantic struggles. Glp."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return [attacker.description("The") + " tries to swallow you down, but you manage to resist their hunger."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 3 - 2 * defender.health / defender.maxHealth; }
  };
}

function tranceGrappleMaul(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-25);
      defender.changeStamina(-50);
      return [attacker.description("The") + " digs into you with his claws and jaws, ripping you apart for " + attack(attacker, defender, attacker.str * 4) + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      }
    ],
    conditions: [
      function(attacker, defender) {
        return defender.prefs.gore;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; },
    gameover: function() { return "Mauled by Trance"; }
  };
}

function tranceGrappleThroat(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.health = 0;
        defender.stamina = 0;
        return ["Trance's pointed snout lunges for your throat, crushing jaws sinking in deep and ripping out your windpipe. He grins and swallows his mouthful of meat...and you fall limp."];
      } else {
        return ["The sergal lunges for your throat, but you manage to keep his terrifying jaws at bay."];
      }
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.gore;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth > attacker.health / attacker.maxHealth ? 2 : 0; },
    gameover: function() { return "Throat ripped out by Trance"; }
  };
}

function tranceDigest(predator,damage=50) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-50);
      return pickRandom([
        [predator.description("The") + "'s powerful stomach grinds over your body, swiftly digesting you."],
        ["The stomach walls clench and squeeze, smearing your squirming body in chyme and stinging acids."],
        ["Your body is crushed and churned, ground against fleshy walls to sate the sergal's hunger."]]);
    },
    priority: 1,
    weight: function() { return 1; }
  };
}

function tranceDigestCrush(predator, damage=75) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-125);
      return ["Trance's belly clenches, crushing your body between walls of ruthless muscle. Bones snap and tendons strain. The chyme floods your mouth."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.gore;
      }
    ],
    priority: 1,
    weight: function() { return 0.5; }
  };
}

function tranceDigestInstakill(predator) {
  return {
    digest: function(player) {
      player.health = -100;
      return ["A ripple of muscle catches your head in just the right way, crushing your skull like a grape. Your lifeless body slumps in the caustic pit of slime and acid...and you melt away."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.gore;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.stamina <= 0 ? 5 : 0.1; }
  };
}

/* TALUTHUS */

function Taluthus() {
  Creature.call(this, "Taluthus", 40, 40, 60);

  this.hasName = true;

  this.description = function() { return "Taluthus"; };

  this.startCombat = function() { return ["You jump back as a hulking kitsune leaps out at you, his four massive tails swaying as he sizes you up."]; };
  this.finishDigest = function() {
    switch(this.flags.grappleType) {
      case "belly": return ["The kitsune's guts break you down..."];
      case "balls": return ["The kitsune melts you down into cum..."];
    }

    return ["The kitsune digests you..."];
  };
  this.defeated = function() { changeMode("explore"); moveToByName("Nature Trail"); update(["The kitsune growls and vanishes in a blinding flash of light. You pass out, eventually coming to in the woods."]); };

  this.prefs.prey = false;
  this.prefs.grapple = false;

  this.attacks.push(taluthusPunchAttack(this));

  this.attacks.push(taluthusGrab(this));
  this.attacks.push(taluthusGrabDevour(this));
  this.attacks.push(taluthusGrabCockVore(this));

  this.attacks.push(taluthusTailDevour(this));

  this.digests = [];

  this.digests.push(taluthusDigest(this));
  this.digests.push(taluthusTailSwallow(this));
  this.digests.push(taluthusCockSwallow(this));
  this.digests.push(taluthusBallsDigest(this));

  this.struggles = [];

  this.struggles.push(taluthusBallStruggle(this));
  this.struggles.push(taluthusBellyStruggle(this));
  this.struggles.push(taluthusTailStruggle(this));
  this.struggles.push(taluthusCockStruggle(this));
  this.struggles.push(submit(this));
}

function taluthusPunchAttack(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.str);
      return ["Taluthus lunges, striking you for " + damage + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function taluthusGrab(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.grappleType = "hands";
        defender.flags.grappled = true;
        return ["The kitsune snatches you up in his stocky grip, lifting you off the ground and cramming your head into his sloppy maw!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Taluthus tries to grab you, but you manage to avoid his grasp."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function taluthusGrabDevour(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = false;
        attacker.flags.grappleType = "belly";
        changeMode("eaten");
        return ["Taluthus forces your head into his glowing throat, swallowing forcefully to pull you down to his predatory depths."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The kitsune forces your head into his gullet, but you manage to pry yourself free before peristalsis can claim you."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; },
      function(attacker, defender) { return attacker.flags.grappleType == "hands"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function taluthusGrabCockVore(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = true;
        attacker.flags.grappleType = "cock";
        attacker.flags.cockSwallows = 4;
        changeMode("eaten");
        return ["Taluthus abruptly shoves you downward, enveloping your feet in his black shaft."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The kitsune tries to force you into his cock, but you keep your feet free."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; },
      function(attacker, defender) { return attacker.flags.grappleType == "hands"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function taluthusTailDevour(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.grappleType = "tail";
        attacker.flags.tailSwallows = 3;
        defender.flags.grappled = true;
        changeMode("eaten");
        return ["You yelp as one of the kitsune's massive tails snakes up, maw splitting wide open and taking you in with ease."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["You leap back as one of the kitsune's huge tails tries to make a meal of you, narrowly escaping the gaping maw."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function taluthusDigest(predator,damage=50) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-50);
      return pickRandom([
        ["Powerful stomach muscles grind at your body, swiftly digesting you."]
      ]);
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "belly"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Digested in the glowing gut of Taluthus"; }
  };
}

function taluthusBallsDigest(predator,damage=50) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-50);
      return pickRandom([
        ["Thick, musky cum smears over your body, steadily breaking you down into seed."]
      ]);
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "balls"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Dissolved into cum by Taluthus"; }
  };
}

function taluthusTailSwallow(predator,damage=50) {
  return {
    digest: function(player) {
      let success = statHealthCheck(predator, player, "str");
      if (success) {
        predator.changeStamina(-5);
        player.changeStamina(-25);
        predator.flags.tailSwallows -= 1;

        if (predator.flags.tailSwallows == 0) {
          player.flags.grappled = false;
          predator.flags.grappleType = "belly";
          return ["A powerful swallow drags you into Taluthus' stomach. You curl up in the bioluminescent prison as it begins to <i>squeeze.</i>"];
        } else {
          return ["A powerful swallow pulls you deeper, further from the world and closer to the kitsune's greedy guts."];
        }
      } else {
        predator.changeStamina(-15);
        player.changeStamina(-25);
        return ["You brace yourself against the walls of the tail's throat, holding yourself in place as a wave of peristalsis rolls past."];
      }
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "tail"; }
    ],
    priority: 1,
    weight: function() { return 1; }
  };
}

function taluthusCockSwallow(predator) {
  return {
    digest: function(player) {
      let success = statHealthCheck(predator, player, "str");
      if (success) {
        predator.changeStamina(-5);
        player.changeStamina(-25);
        predator.flags.cockSwallows -= 1;

        if (predator.flags.cockSwallows == 0) {
          player.flags.grappled = false;
          predator.flags.grappleType = "balls";
          return ["A final clench drags you all the way into the kitsune's balls. Your body is roughly crammed into a lake of blue cum, squeezed on all sides by hot, musky flesh."];
        } else {
          return ["A powerful swallow pulls you deeper into Taluthus' shaft."];
        }
      } else {
        predator.changeStamina(-15);
        player.changeStamina(-25);
        return ["You brace yourself against the walls of the crushing shaft, holding yourself in place as he clenches."];
      }
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "cock"; }
    ],
    priority: 1,
    weight: function() { return 1; }
  };
}

function taluthusBellyStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        player.clear();
        predator.clear();
        return {
          "escape": "stay",
          "lines": ["You struggle and squirm, forcing " + predator.description("the") + " to hork you up. They're not done with you yet..."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within " + predator.description("the") + " to no avail."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "belly";
      }
    ]
  };
}

function taluthusBallStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        player.clear();
        predator.clear();
        return {
          "escape": "stay",
          "lines": ["You struggle and squirm, forcing Tal to let you out of his cock. He's not done with you yet..."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within Tal's balls, to no avail."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "balls";
      }
    ]
  };
}

function taluthusTailStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      let position = "";

      switch(predator.flags.tailSwallows) {
        case 1:
          position = "You're one good swallow away from being dragged into Tal's stomach.";
          break;
        case 2:
          position = "Your bulge is perilously deep in the kitsune's tail, hanging close to the ground.";
          break;
        case 3:
          position = "You're halfway down the beast's tail, utterly smothered by heat and muscle.";
          break;
        case 4:
          position = "You're close to freedom, your paws hanging from that wretched tailmaw.";
          break;
      }

      if (escape) {
        predator.flags.tailSwallows += 1;

        if (predator.flags.tailSwallows > 4) {
          return {
            "escape": "stay",
            "lines": ["You struggle and squirm, forcing your way out from the kitsune's voracious tail."]
          };
        } else {
          return {
            "escape": "stuck",
            "lines": ["You struggle and squirm, inching closer to freedom.", newline, position]
          };
        }
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within Tal's tail, to no avail.", newline, position]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "tail" && predator.flags.tailSwallows > 0;
      }
    ]
  };
}

function taluthusCockStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      let position = "";

      switch(predator.flags.cockSwallows) {
        case 1:
          position = "You're one clench away from being dragged into Tal's balls, utterly lost inside that throbbing cock.";
          break;
        case 2:
          position = "Your face is grinding against the tip of the sune's shaft.";
          break;
        case 3:
          position = "Your upper body is still hanging outside of Tal's cock.";
          break;
        case 4:
          position = "You're almost free - only your legs are trapped in that tight sune cock.";
          break;
      }

      if (escape) {
        predator.flags.tailSwallows += 1;

        if (predator.flags.tailSwallows > 4) {
          return {
            "escape": "stay",
            "lines": ["You struggle and squirm, forcing your way out from the kitsune's voracious shaft."]
          };
        } else {
          return {
            "escape": "stuck",
            "lines": ["You struggle and squirm, inching closer to freedom.", newline, position]
          };
        }
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within Tal's shaft, to no avail.", newline, position]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "cock" && predator.flags.cockSwallows > 0;
      }
    ]
  };
}

/* SELICIA */
function Selicia() {
  Creature.call(this, "Selicia", 25, 25, 25);

  this.hasName = true;

  this.description = function() { return "Selicia"; };

  this.startCombat = function() { return ["You stumble across a small cave. Stepping closer to investigate, you find yourself face-to-face with a glossy, slender dragon! Her ten-foot body is matched by a tail that's nearly as long, and she looms over you, devious blue eyes framed by curved horns."]; };
  this.finishDigest = function() {
    switch(this.flags.voreType) {
      case "stomach": return ["The dragoness's belly breaks you down..."];
      case "womb": return ["Your struggles slow, then stop, as your body is broken down to slick femcum by the dragoness's greedy womb. She quivers and groans with pent-up lust, grinding against the wall to set herself off - bringing forth a flood of hot, clingy nectar from her depths. The eruption sprays over the wall and ground, gushing in great spurts as she pants and thrusts with tail held high.",newline,"You were nothing but an orgasm..."];
    }

    return ["The dragoness digests you..."];
  };

  this.defeated = function() { startDialog(FallenFoe(this)); };

  this.prefs.scat = false;
  this.prefs.analVore = false;

  this.attacks = [];

  this.attacks.push(seliciaBite(this));
  this.attacks.push(seliciaTailSlap(this));

  this.attacks.push(seliciaGrab(this));
  this.attacks.push(seliciaGrabSwallow(this));
  this.attacks.push(seliciaGrabUnbirth(this));

  this.attacks.push(seliciaPin(this));
  this.attacks.push(seliciaPinUnbirth(this));

  this.digests = [];

  this.digests.push(seliciaStomachDigest(this));
  this.digests.push(seliciaUnbirthPull(this));
  this.digests.push(seliciaWombDigest(this));

  this.struggles = [];

  this.struggles.push(seliciaStomachStruggle(this));
  this.struggles.push(seliciaUnbirthStruggle(this));
  this.struggles.push(seliciaWombStruggle(this));
  this.struggles.push(submit(this));
}

function seliciaBite(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.str);
      return ["Selicia lunges, biting you for " + damage + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function seliciaTailSlap(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.dex * 1.5);
      return ["Selicia's tail sweeps around, slapping you for " + damage + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function seliciaGrab(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.voreType = "stomach";
        defender.flags.grappled = true;
        return ["The dragoness's jaws splay wide, glowing flesh entrancing you...and then enveloping you. She takes your upper body into her maw with ease."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Selicia tries to snatch you up in her maw, but you manage to dive out of the way."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function seliciaGrabSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = false;
        changeMode("eaten");
        return ["Selicia tips her head back and swallows, dragging your body down her long throat and into her empty stomach."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The dragoness tilts back her head and swallows. You manage to resist the pull, hanging on with your legs dangling from her jaws."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "stomach"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function seliciaGrabUnbirth(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-75);
      attacker.flags.voreType = "womb";
      changeMode("eaten");
      return ["Selicia rolls onto her back, curls up, and opens her jaws. You briefly think you're free...and then, your plunge into her nethers, dragged all the way into her womb by a massive <i>gulp</i> of greedy, overwheling muscle."];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "stomach"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}


function seliciaPin(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "dex");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.voreType = "unbirth";
        defender.flags.grappled = true;
        return ["The beast lunges, bowling you over. She leaps up, spinning about mid-air, and lands hard on your prone body, grinding her hips - and her glistening nethers - over your face."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Selicia leaps at you, forcing you to stumble backwards to avoid being crushed!"];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function seliciaPinUnbirth(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        changeMode("eaten");
        return ["Selicia's hips slam down, forcing your head into her cooch. Rippling muscle yanks you in up to your hips, leaving your flailing legs hanging from her nethers."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The dragoness grinds on your face, trying to force it into her snatch - but you manage to resist, for now."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "unbirth"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function seliciaUnbirthPull(predator) {
  return {
    digest: function(player) {
      let pull = Math.random() >= player.stamina / player.maxStamina;
      if (pull) {
        let success = statHealthCheck(predator, player, "str") || player.stamina <= 0;
        if (success) {
          predator.changeStamina(-5);
          player.changeStamina(-25);
          predator.flags.voreType = "womb";
          return ["A powerful swallow drags you into the slick, luminescent womb of Selicia. The walls clench and squeeze over your tender body, coaxing you to <i>melt.</i>"];
        } else {
          predator.changeStamina(-15);
          player.changeStamina(-25);
          return ["You grit your teeth and shove yourself back, resisting the powerful pull of the dragon's depths."];
        }
      } else {
        predator.changeStamina(-25);
        player.changeStamina(-150);
        return ["Selicia shoves her hips against the cave wall, grinding you into her nethers - then relaxing, and letting you slide back. Being used as her toy exhausts you..."];
      }

    },
    requirements: [
      function(attacker, defender) { return attacker.flags.voreType == "unbirth"; }
    ],
    priority: 1,
    weight: function() { return 1; }
  };
}

function seliciaStomachDigest(predator) {
  return {
    digest: function(player) {
      attack(predator, player, 50);
      player.changeStamina(-20);
      return ["Selicia's stomach clenches and grinds, dousing you in her acids."];
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.voreType == "stomach"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Digested in the depths of Selicia"; }
  };
}

function seliciaWombDigest(predator) {
  return {
    digest: function(player) {
      attack(predator, player, 50);
      predator.changeStamina(-5);
      player.changeStamina(-25);

      let lines = ["Selicia's womb-walls ripple and knead, softening your body bit-by-bit."];

      if (Math.random() < 0.25 && player.health > 0) {
        predator.flags.voreType = "unbirth";
        lines = lines.concat([newline,"A powerful clench of muscle forces you out of her womb! You're still stuck in her snatch, though..."]);
      }

      return lines;
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.voreType == "womb"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Melted into femcum by Selicia"; }
  };
}

function seliciaStomachStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        return {
          "escape": "stay",
          "lines": ["Your struggles force Selicia to hork you up, leaving you dazed and confused on the ground."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe, to no avail. The stomach walls squeeze tighter."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.voreType == "stomach";
      }
    ]
  };
}

function seliciaWombStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        predator.flags.voreType = "unbirth";
        return {
          "escape": "stuck",
          "lines": ["Your struggles force the dragon to let you out of her womb...but you're still stuck in her snatch."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within the velvety walls of Selicia's womb, to no avail."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.voreType == "womb";
      }
    ]
  };
}

function seliciaUnbirthStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        player.clear();
        predator.clear();
        return {
          "escape": "stay",
          "lines": ["With a mighty shove, you pop free of the dragoness's cooch - a loud, lewd <i>shllk</i> announcing your return to the world."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe, to no avail."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.voreType == "unbirth";
      }
    ]
  };
}
