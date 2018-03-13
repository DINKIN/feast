"use strict";

function attack(attacker, defender, baseDamage) {
  let damage = Math.round((Math.random() * 0.5 - 0.25 + 1) * baseDamage);
  defender.health -= damage;
  return damage;
}

function isNormal(entity) {
  return entity.grappled != true;
}

function isGrappled(entity) {
  return entity.grappled == true;
}

function punchAttack(attacker) {
  return {
    name: "Punch",
    desc: "Punch a nerd",
    attack: function(defender) {
      return "You punch the " + defender.description() + " for " + attack(attacker, defender, attacker.str) + " damage";
    },
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " punches you for " + attack(attacker, defender, attacker.str) + " damage";
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
  };
}

function flankAttack(attacker) {
  return {
    name: "Flank",
    desc: "Be sneaky",
    attack: function(defender) {
      return "You run around the " + defender.description() + " and attack for " + attack(attacker, defender, attacker.dex) + " damage";
    },
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " runs past you, then turns and hits you for " + attack(attacker, defender, attacker.str) + " damage";
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
  };
}

function grapple(attacker) {
  return {
    name: "Grapple",
    desc: "Try to grab your opponent",
    attack: function(defender) {
      let success = Math.random() < 0.5;
      if (success) {
        defender.grappled = true;
        return "You charge at the " + defender.description() + ", tackling them and knocking them to the ground.";
      } else {
        return "You charge at the " + defender.description() + ", but they dodge out of the way!";
      }
    },
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5;
      if (success) {
        defender.grappled = true;
        return "The " + attacker.description() + " lunges at you, pinning you to the floor!";
      } else {
        return "The " + attacker.description() + " tries to tackle you, but you deftly avoid them.";
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
  };
}

function grappleDevour(attacker) {
  return {
    name: "Devour",
    desc: "Try to consume your grappled opponent",
    attack: function(defender) {
      let success = Math.random() < 0.25 + (1 - defender.health / defender.maxHealth) * 0.75;
      if (success) {
        attacker.stomach.feed(defender);
        defender.grappled = false;
        changeMode("explore");
        return "You open your jaws wide, stuffing the " + defender.description() + "'s head into your gullet and greedily wolfing them down. Delicious.";
      } else {
        return "Your jaws open wide, but the " + defender.description() + " manages to avoid becoming " + attacker.species + " chow.";
      }
    },
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5 + (1 - defender.health / defender.maxHealth)*0.5 && Math.random() < 0.5;
      if(success) {
        defender.grappled = false;
        changeMode("eaten");
        return "The " + attacker.description() + " forces your head into their sloppy jaws, devouring you despite your frantic struggles. Glp.";
      } else {
        return "The " + attacker.description() + " tries to swallow you down, but you manage to resist their hunger.";
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); }
    ], conditions: [
      function(prefs, player=false) { return player || prefs.player.prey; }
    ],
    priority: 1,
  };
}

function grappleAnalVore(attacker) {
  return {
    name: "Anal Vore",
    desc: "Try to shove your opponent up your ass.",
    attack: function(defender) {
      let success = Math.random() < 0.25 + (1 - defender.health / defender.maxHealth) * 0.75;
      if (success) {
        attacker.butt.feed(defender);
        defender.grappled = false;
        changeMode("explore");
        return "You shove the " + defender.description() + " between your cheeks. Their head slips into your ass with a wet <i>shlk</i>, and the rest of their body follows suit. You moan and gasp, working them deeper and deeper...";
      } else {
        return "Your grasp and shove the " + defender.description() + ", but they manage to avoid becoming " + attacker.species + " chow.";
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); }
    ], conditions: [
      function(prefs, player=false) { return player || prefs.player.prey; }
    ],
    priority: 1,
  };
}

function grappleRelease(attacker) {
  return {
    name: "Release",
    desc: "Release your opponent",
    attack: function(defender) {
      defender.grappled = false;
      return "You throw the " + defender.description() + " back, dealing " + attack(attacker, defender, attacker.str*1.5) + " damage";
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
      let success = Math.random() < 0.5 + (1 - defender.health / defender.maxHealth)*0.5;
      if (success) {
        attacker.grappled = false;
        return "You struggle and shove the " + defender.description() + " off of you.";
      } else {
        return "You struggle, but to no avail.";
      }
    },
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5 + (1 - defender.health / defender.maxHealth)*0.5 && Math.random() < 0.5;
      if (success) {
        attacker.grappled = false;
        return "Your prey shoves you back, breaking your grapple!";
      } else {
        return "Your prey squirms, but remains pinned.";
      }
    },
    requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormal(defender); }
    ],
    priority: 1,
  };
}

function grappledReverse(attacker) {
  return {
    name: "Reversal",
    desc: "Try to pin your grappler. Less likely to work than struggling.",
    attack: function(defender) {
      let success = Math.random() < 0.25 + (1 - defender.health / defender.maxHealth) * 0.5;
      if (success) {
        attacker.grappled = false;
        defender.grappled = true;
        return "You surprise the " + defender.description() + " with a burst of strength, flipping them over and pinning them.";
      } else {
        return "You try to throw your opponent off of you, but fail.";
      }
    },
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5 + (1 - defender.health / defender.maxHealth)*0.5 && Math.random() < 0.5;
      if (success) {
        attacker.grappled = false;
        defender.grappled = true;
        return "Your prey suddenly grabs hold and flips you over, pinning you!";
      } else {
        return "Your prey tries to grab at you, but you keep them under  control.";
      }
    },
    requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormal(defender); }
    ],
    priority: 1,
  };
}

function pass(attacker) {
  return {
    name: "Pass",
    desc: "You can't do anything!",
    attack: function(defender) {
      return "You do nothing.";
    },
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " does nothing.";
    },
    priority: 0,
  };
}

function devourPlayer(attacker) {
  return {
    name: "Devours YOU!",
    desc: "You won't see this",
    conditions: [
      function(prefs) { return prefs.player.prey; }
    ],
    requirements: [
      function(attacker, defender) { return attacker.leering == true; }
    ],
    attackPlayer: function(defender) {
      changeMode("eaten");
      return "The voracious " + attacker.description() + " pins you down and devours you in seconds.";
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
      return "The " + attacker.description() + " leers at you.";
    },
    requirements: [
      function(attacker, defender) { return attacker.leering != true && attacker.grappled != true; }
    ],
    priority: 1,
  };
}

function poke(attacker) {
  return {
    name: "Poke",
    desc: "Poke a nerd",
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " pokes you on the snout for " + attack(attacker, defender, 1e12) + " damage";
    },
    priority: 1,
  };
}

function digestPlayerStomach(predator,damage=20) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      return "The " + predator.description() + "'s stomach grinds over your body, swiftly digesting you.";
    },
    priority: 1,
  };
}
