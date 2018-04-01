"use strict";

function DialogNode() {
  this.text = [];
  this.hooks = [];

  this.requirements = [];

  this.visit = function() {
    for (let i=0; i<this.hooks.length; i++)
      this.hooks[i]();
  };

  this.choices = [];

  this.addChoice = function(text,node,tests=[]) {
    this.choices.push({"text": text, "node": node, "tests": []});
  };
}

function EatDude() {
  DialogNode.call(this);

  let nerd = new Anthro();

  this.text = ["You approach " + nerd.description("the")];

  let eatHim = new DialogNode();

  eatHim.text = ["You eat the nerd. Burp."];
  eatHim.hooks.push(function() { player.stomach.feed(nerd); });

  let dontEatHim = new DialogNode();
  dontEatHim.text = ["You don't eat the nerd."];

  this.addChoice("Eat him lol",eatHim);
  this.addChoice("Actually don't",dontEatHim);
}

function PhoneCall() {
  DialogNode.call(this);

  this.text = ["You pick up the phone. Who do you want to call?"];

  {
    let nodeFen = new DialogNode();
    this.addChoice("Pizza time",nodeFen);
    nodeFen.text = ["Pizza time"];
  }

    {
      let nodeFen = new DialogNode();
      this.addChoice("Pizza time",nodeFen);
      nodeFen.text = ["Pizza time"];
      nodeFen.hooks.push(function() {
        update(["You die instantly",newline,"Pizza time :("]);
        respawn(respawnRoom);
      });
    }
      {
        let nodeFen = new DialogNode();
        this.addChoice("Pizza time",nodeFen);
        nodeFen.text = ["Pizza time"];
      }
        {
          let nodeFen = new DialogNode();
          this.addChoice("Pizza time",nodeFen);
          nodeFen.text = ["Pizza time"];
        }
}

function FallenFoe(foe) {
  DialogNode.call(this);

  this.text = [foe.description("The") + " falls to the ground!", newline, "What do you want to do with your enemy?"];

  {
    let nodeEat = new DialogNode();
    this.addChoice("Devour!",nodeEat);
    nodeEat.text = ["You grab your helpless prey and force them down your gullet. You hack up their wallet a minute later, finding $" + foe.cash + " inside."];

    nodeEat.requirements.push( function(attacker, defender) {
      return defender.prefs.prey;
    });

    nodeEat.hooks.push(function() {
      player.cash += foe.cash;
    });

    nodeEat.hooks.push(function() {
      player.stomach.feed(foe);
    })
  }

  {
    let nodeSpare = new DialogNode();
    this.addChoice("Spare",nodeSpare);
    nodeSpare.text = ["You decide to leave your foe uneaten.", newline, "You do help yourself to the $" + foe.cash + " in their pockets, though."];

    nodeSpare.hooks.push(function() {
      player.cash += foe.cash;
    });
  }

  {
    let nodeCrush = new DialogNode();
    this.addChoice("Crush",nodeCrush);
    nodeCrush.text = ["You slam your paw down hard, crushing " + foe.description("the") + " like a bug"];
    nodeCrush.requirements.push( function(attacker, defender) {
      return defender.flags.shrunk == true;
    });
  }
}

function NatureExercise() {
  DialogNode.call(this);

  this.text = ["What do you want to do?"];

  {
    let nodeStrength = new DialogNode();
    this.addChoice("Rock Climbing (+STR)", nodeStrength);
    nodeStrength.text = ["You clamber up walls for a while. You feel a little stronger."];
    nodeStrength.hooks.push(function() {
      player.str += 1;
      advanceTime(60*30);
    });
  }

  {
    let nodeDexterity = new DialogNode();
    this.addChoice("Jogging (+DEX)", nodeDexterity);
    nodeDexterity.text = ["You go run for a run around the three-mile-long trail. You feel a little more agile."];
    nodeDexterity.hooks.push(function() {
      player.dex += 1;
      advanceTime(60*30);
    });
  }

  {
    let nodeConstitution = new DialogNode();
    this.addChoice("Bang your head on a tree (+CON)", nodeConstitution);
    nodeConstitution.text = ["You bash your face on a tree for half an hour. I guess that helps."];
    nodeConstitution.hooks.push(function() {
      player.con += 1;
      advanceTime(60*30);
    });
  }
}

function VendingMachinePurchase() {
  DialogNode.call(this);

  this.text = ["You walk up to the vending machine. A variety of foodstuffs and drinks are on display...along with some more unconventional items."];

  {
    let nodeCandy = new DialogNode();
    this.addChoice("Buy a candy bar ($2, +50 stamina)", nodeCandy);
    nodeCandy.text = ["You insert two dollar bills into the machine and select the candy bar. It explodes and kills you."];

    nodeCandy.hooks.push(function() {
      killingBlow = {};
      killingBlow.gameover = function() { return "oops!"; };
      player.cash -= 2;
      player.changeStamina(50);
      respawn(respawnRoom);
    });

    nodeCandy.requirements.push(function(player) {
      return player.cash >= 2;
    });
  }

  {
    let nodeSoda = new DialogNode();
    this.addChoice("Buy a soda ($4, +150 stamina)", nodeSoda);
    nodeSoda.text = ["You insert a dollar and coins, then select a soda. You're pretty you saw something on the news about it turning people purple, but you can't resist that delicious Citrus Substitute Flavor&trade;. It explodes and kills you."];

    nodeSoda.hooks.push(function() {
      killingBlow = {};
      killingBlow.gameover = function() { return "oops!"; };
      player.cash -= 2;
      player.changeStamina(150);
      respawn(respawnRoom);
    });

    nodeSoda.requirements.push(function(player) {
      return player.cash >= 2;
    });
  }

  {
    let prey = new Micro();
    let nodeMicro = new DialogNode();
    this.addChoice("Buy a micro ($10)", nodeMicro);
    nodeMicro.text = ["You stuff a wad of bills into the machine. " + prey.description("A") + " tumbles into the vending slot; you scoop them up and stuff them into your jaws without a second thought. Tasty. It explodes and kills you."];

    nodeMicro.hooks.push(function() {
      killingBlow = {};
      killingBlow.gameover = function() { return "oops!"; };
      player.stomach.feed(prey);
      player.cash -= 10;
      respawn(respawnRoom);
    });

    nodeMicro.requirements.push(function(player) {
      return player.cash >= 10;
    });
  }

  {
    let nodeCancel = new DialogNode();
    this.addChoice("Nevermind", nodeCancel);
    nodeCancel.text = ["You decide to not purchase anything."];
  }
}
