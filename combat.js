"use strict";

function attack(attacker, defender, baseDamage) {
  let damage = Math.round((Math.random() * 0.5 - 0.25 + 1) * baseDamage);
  defender.health -= damage;
  return damage;
}

function isNormal(entity) {
  return entity.flags.grappled != true && entity.flags.shrunk != true;
}

function isNormalSize(entity) {
  return entity.flags.shrunk != true;
}

function isGrappled(entity) {
  return entity.flags.grappled == true;
}

function doComp(attackStat, defendStat) {
  return Math.random() * attackStat > Math.random() * defendStat;
}

function statCheck(attacker, defender, stat) {
  return doComp(attacker[stat], defender[stat]);
}

function statHealthCheck(attacker, defender, stat) {
  let attackerPercent = attacker.health / attacker.maxHealth;
  let defenderPercent = defender.health / defender.maxHealth;

  if (attacker.stamina <= 0)
    attackerPercent /= 2;
  if (defender.stamina <= 0)
    defenderPercent /= 2;

  return doComp(attacker[stat] * attackerPercent, defender[stat] * defenderPercent);
}

function punchAttack(attacker) {
  return {
    name: "Punch",
    desc: "Punch a nerd",
    attack: function(defender) {

      return ["You punch " + defender.description("the") + " for " + attack(attacker, defender, attacker.str) + " damage"];
    },
    attackPlayer: function(defender) {
      return [attacker.description("The") + " punches you for " + attack(attacker, defender, attacker.str) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function flankAttack(attacker) {
  return {
    name: "Flank",
    desc: "Be sneaky",
    attack: function(defender) {
      return ["You run around " + defender.description("the") + " and attack for " + attack(attacker, defender, attacker.dex) + " damage"];
    },
    attackPlayer: function(defender) {
      return [attacker.description("The") + " runs past you, then turns and hits you for " + attack(attacker, defender, attacker.str) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function grapple(attacker, weightFactor = 1) {
  return {
    name: "Grapple",
    desc: "Try to grab your opponent",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-20);
        defender.changeStamina(-20);
        defender.flags.grappled = true;
        return ["You charge at " + defender.description("the") + ", tackling them and knocking them to the ground."];
      } else {
        attacker.changeStamina(-20);
        return ["You charge at " + defender.description("the") + ", but they dodge out of the way!"];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-20);
        defender.changeStamina(-20);
        defender.flags.grappled = true;
        return [attacker.description("The") + " lunges at you, pinning you to the floor!"];
      } else {
        return [attacker.description("The") + " tries to tackle you, but you deftly avoid them."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); },
      function(attacker, defender) { return defender.prefs.grapple; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return weightFactor - weightFactor * defender.health / defender.maxHealth; }
  };
}

function grappleSubdue(attacker) {
  return {
    name: "Subdue",
    desc: "Try to subdue your opponent",
    attack: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-30);
      return ["You beat on " + defender.description("the") + " for " + attack(attacker, defender, attacker.str * 2) + " damage."];
    },
    attackPlayer: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-30);
      return [attacker.description("The") + " beats you for " + attack(attacker, defender, attacker.str * 2) + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function grappleDevour(attacker) {
  return {
    name: "Devour",
    desc: "Try to consume your grappled opponent",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-25);
        attacker.stomach.feed(defender);
        defender.flags.grappled = false;
        changeMode("explore");
        attacker.cash += defender.cash;
        return ["You open your jaws wide, stuffing " + defender.description("the") + "'s head into your gullet and greedily wolfing them down. Delicious.", newline, "You hack up their wallet with $" + defender.cash + " inside a moment later. Nice!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-10);
        return ["Your jaws open wide, but " + defender.description("the") + " manages to avoid becoming " + attacker.species + " chow."];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        defender.flags.grappled = false;
        changeMode("eaten");
        return [attacker.description("The") + " forces your head into their sloppy jaws, devouring you despite your frantic struggles. Glp."];
      } else {
        return [attacker.description("The") + " tries to swallow you down, but you manage to resist their hunger."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 - defender.health / defender.maxHealth; }
  };
}

function grappledDevour(attacker) {
  return {
    name: "Devour",
    desc: "Try to consume your grappling opponent",
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        defender.flags.grappled = false;
        changeMode("eaten");
        return [attacker.description("The") + " breaks your pin and crams your upper body into their maw, swallowing you down in seconds."];
      } else {
        attacker.changeStamina(-10);
        return [attacker.description("The") + " thrashes at you in an attempt to devour you, but you avoid their jaws."];
      }
    }, requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormal(defender) && attacker.flags.shrunk != true; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
  };
}

function grappleAnalVore(attacker) {
  return {
    name: "Anal Vore",
    desc: "Try to shove your opponent up your ass.",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-25);
        attacker.butt.feed(defender);
        defender.flags.grappled = false;
        attacker.cash += defender.cash;
        changeMode("explore");
        return ["You shove " + defender.description("the") + " between your cheeks. Their head slips into your ass with a wet <i>shlk</i>, and the rest of their body follows suit. You moan and gasp, working them deeper and deeper.", newline, "You notice their wallet with $" + defender.cash + " lying on the ground. Score!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-10);
        return ["Your grasp and shove " + defender.description("the") + ", but they manage to avoid becoming " + attacker.species + " chow."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true ; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey && defender.prefs.analVore; }
    ],
    priority: 1,
  };
}

function grappleRelease(attacker) {
  return {
    name: "Release",
    desc: "Release your opponent",
    attack: function(defender) {
      defender.flags.grappled = false;
        defender.changeStamina(-15);
      return ["You throw " + defender.description("the") + " back, dealing " + attack(attacker, defender, attacker.str*1.5) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); }
    ],
    priority: 1,
  };
}

function grappledStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to break your opponent's pin",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-10);
        attacker.flags.grappled = false;
        return ["You struggle and shove " + defender.description("the") + " off of you."];
      } else {
        attacker.changeStamina(-10);
        defender.changeStamina(-5);
        return ["You struggle, but to no avail."];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-10);
        attacker.flags.grappled = false;
        return ["Your prey shoves you back, breaking your grapple!"];
      } else {
        attacker.changeStamina(-10);
        defender.changeStamina(-5);
        return ["Your prey squirms, but remains pinned."];
      }
    },
    requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormalSize(attacker) && isNormal(defender); }
    ],
    priority: 1,
  };
}

function grappledReverse(attacker) {
  return {
    name: "Reversal",
    desc: "Try to pin your grappler. Less likely to work than struggling.",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-15);
        attacker.flags.grappled = false;
        defender.flags.grappled = true;
        return ["You surprise " + defender.description("the") + " with a burst of strength, flipping them over and pinning them."];
      } else {
        attacker.changeStamina(-15);
        return ["You try to throw your opponent off of you, but fail."];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-15);
        attacker.flags.grappled = false;
        defender.flags.grappled = true;
        return ["Your prey suddenly grabs hold and flips you over, pinning you!"];
      } else {
        attacker.changeStamina(-15);
        return ["Your prey tries to grab at you, but you keep them under  control."];
      }
    },
    requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormalSize(attacker) && isNormal(defender); },
      function(attacker, defender) { return defender.flags.grapple; }
    ],
    priority: 1,
  };
}

function shrunkGrapple(attacker) {
  return {
    name: "Grab",
    desc: "Grab this fun-sized snack",
    attack: function(defender) {
      let success = statCheck(attacker, defender, "dex") || statCheck(attacker, defender, "dex");
      if (success) {
        defender.changeStamina(-25);
        defender.flags.grappled = true;
        return ["You snatch up " + defender.description("the")];
      } else {
        return ["You try to grab " + defender.description("the") + ", but they elude your grasp."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.grappled != true && defender.flags.shrunk == true;
      }
    ],
    priority: 2
  };
}

function shrunkSwallow(attacker) {
  return {
    name: "Swallow",
    desc: "Swallow your prey",
    attack: function(defender) {
      defender.changeStamina(-50);
      changeMode("explore");
      attacker.stomach.feed(defender);
      return ["With a light swallow, " + defender.description("the") + " is dragged down to your sloppy guts."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.grappled == true && defender.flags.shrunk == true;
      }
    ],
    priority: 2
  };
}

function shrunkStomp(attacker) {
  return {
    name: "Stomp",
    desc: "Stomp on your shrunken prey",
    attack: function(defender) {
      let success = statCheck(attacker, defender, "dex") || statCheck(attacker, defender, "dex") || defender.stamina == 0;
      defender.stamina = 0;
      defender.health = Math.max(0, defender.health - 50);
      return ["Your paw comes crashing down on " + defender.description("the") + ", burying them under your heavy toes and pinning them down hard."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.grappled != true && defender.flags.shrunk == true;
      }
    ]
  };
}

function flee(attacker) {
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
      function(attacker, defender) { return isNormal(attacker) && !attacker.isGrappling; }
    ]
  };
}

function pass(attacker) {
  return {
    name: "Pass",
    desc: "You can't do anything!",
    attack: function(defender) {
      return ["You do nothing."];
    },
    attackPlayer: function(defender) {
      return [attacker.description("The") + " does nothing."];
    },
    priority: 0,
  };
}

function devourPlayer(attacker) {
  return {
    name: "Devours YOU!",
    desc: "You won't see this",
    conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    requirements: [
      function(attacker, defender) { return attacker.leering == true; }
    ],
    attackPlayer: function(defender) {
      changeMode("eaten");
      return ["The voracious " + attacker.description() + " pins you down, his slimy maw spreading wide and engulfing your upper body with ease. He swallows and shoves you deeper, cramming your succulent frame into churning, crushing depths in seconds. A lazy, drawn-out <i>belch</i> escapes his gullet, his hunger briefly sated...and your existence now in inescapable peril."];
    },
    priority: 1,
  };
}

function leer(attacker) {
  return {
    name: "Leer",
    desc: "Leer at something",
    attackPlayer: function(defender) {
      attacker.leering = true;
      defender.changeStamina(-100);
      return [attacker.description("The") + " leers at you."];
    },
    requirements: [
      function(attacker, defender) { return attacker.leering != true && attacker.flags.grappled != true; }
    ],
    priority: 1,
  };
}

function poke(attacker) {
  return {
    name: "Poke",
    desc: "Poke a nerd",
    attackPlayer: function(defender) {
      return [attacker.description("The") + " pokes you on the snout for " + attack(attacker, defender, 1e12) + " damage"];
    },
    priority: 1,
  };
}

function digestPlayerStomach(predator,damage=20) {
  return {
    digest: function(player) {
      player.changeStamina(-25);
      attack(predator, player, damage);
      return [predator.description("The") + "'s stomach grinds over your body, swiftly digesting you."];
    },
    priority: 1,
    gameover: function() { return "Digested by " + predator.description("a"); }
  };
}

function instakillPlayerStomach(pedator) {
  return {
    digest: function(player) {
      player.health = -100;
      return ["The stomach walls churn, clench, and swiftly crush you into nothingnes."];
    },
    priority: 1,
    weight: function(attacker, defender) { return 1/3; },
    gameover: function() { return "Digested by " + predator.description("a"); }
  };
}
