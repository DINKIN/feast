let world = null;

let currentRoom = null;
let currentDialog = null;

let currentFoe = null;

let dirButtons = [];
let mode = "explore";
let actions = [];
let time = 9*60*60;
let date = 1;
let newline = "&nbsp;";

let player = new Player();
let playerAttacks = [];

let struggles = [];

let killingBlow = null;

let deaths = [];
let respawnRoom;

let noLog = false;
let logPadLine = undefined;

let MIDNIGHT = 0;
let MORNING = 21600;
let NOON = 43200;
let EVENING = 64800;

function toggleLog() {
  noLog = !noLog;

  if (noLog) {
    document.getElementById("log-button").innerHTML = "Log: Disabled";
  } else {
    document.getElementById("log-button").innerHTML = "Log: Enabled";
  }
}

function join(things) {
  if (things.length == 1) {
    return things[0].description("a");
  } else if (things.length == 2) {
    return things[0].description("a") + " and " + things[1].description("a");
  } else {
    let line = "";
    line = things.slice(0,-1).reduce((line, prey) => line + prey.description("a") + ", ", line);
    line += " and " + things[things.length-1].description("a");
    return line;
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pick(list, attacker, defender) {
  if (list.length == 0)
    return null;
  else {
    let sum = list.reduce((sum, choice) => choice.weight == undefined ? sum + 1 : sum + choice.weight(attacker, defender), 0);

    let target = Math.random() * sum;

    for (let i = 0; i < list.length; i++) {
      sum -= list[i].weight == undefined ? 1 : list[i].weight(attacker, defender);
      if (sum <= target) {
        return list[i];
      }
    }

    return list[list.length-1];
  }
}

function filterValid(options, attacker, defender) {
  let filtered = options.filter(option => option.conditions == undefined || option.conditions.reduce((result, test) => result && test(attacker, defender), true));
  return filtered.filter(option => option.requirements == undefined || option.requirements.reduce((result, test) => result && test(attacker, defender), true));
}

function filterPriority(options) {
  let max = options.reduce((max, option) => option.priority > max ? option.priority : max, -1000);
  return options.filter(option => option.priority == max);
}

function round(number, digits) {
  return Math.round(number * Math.pow(10,digits)) / Math.pow(10,digits);
}

function updateExploreCompass() {
  for (let i = 0; i < dirButtons.length; i++) {
    let button = dirButtons[i];
    button.classList.remove("active-button");
    button.classList.remove("inactive-button");
    button.classList.remove("disabled-button");
    if (currentRoom.exits[i] == null) {
      button.disabled = true;
      button.classList.add("inactive-button");
      button.innerHTML = "";
    } else {
      if (currentRoom.exits[i].conditions.reduce((result, test) => result && test(player.prefs), true)) {
        button.disabled = false;
        button.classList.add("active-button");
        button.innerHTML = currentRoom.exits[i].name;
      } else {
        button.disabled = true;
        button.classList.add("disabled-button");
        button.innerHTML = currentRoom.exits[i].name;
      }
    }
  }
}
function updateExploreActions() {
  updateActions();

  let actionButtons = document.querySelector("#actions");

  actionButtons.innerHTML = "";

  for (let i = 0; i < actions.length; i++) {
    let button = document.createElement("button");
    button.innerHTML = actions[i].name;
    button.classList.add("active-button");
    button.classList.add("action-button");
    button.addEventListener("click", function() { actions[i].action(); });
    actionButtons.appendChild(button);
  }
}

function updateExplore() {
  updateExploreCompass();
  updateExploreActions();
}

function updateEaten() {
  let list = document.getElementById("eaten");

  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  if (player.health > 0)
    struggles = filterValid(currentFoe.struggles, currentFoe, player);
  else
    struggles = [submit(currentFoe)];

  for (let i = 0; i < struggles.length; i++) {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("eaten-button");
    button.innerHTML = struggles[i].name;
    button.addEventListener("click", function() { struggleClicked(i); } );
    button.addEventListener("mouseover", function() { struggleHovered(i); } );
    button.addEventListener("mouseout", function() { document.getElementById("eaten-desc").innerHTML = ""; } );
    li.appendChild(button);
    list.appendChild(li);
  }

}
function updateCombat() {
  let list = document.getElementById("combat");

  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  if (player.health > 0)
    if (currentFoe.playerAttacks == undefined)
      playerAttacks = filterValid(player.attacks, player, currentFoe);
    else
      playerAttacks = filterValid(currentFoe.playerAttacks.map(attack => attack(player)), player, currentFoe);
  else
    playerAttacks = [pass(player)];

  if (playerAttacks.length == 0)
    playerAttacks = [player.backupAttack];

  for (let i = 0; i < playerAttacks.length; i++) {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("combat-button");
    button.innerHTML = playerAttacks[i].name;
    button.addEventListener("click", function() { attackClicked(i); } );
    button.addEventListener("mouseover", function() { attackHovered(i); } );
    button.addEventListener("mouseout", function() { document.getElementById("combat-desc").innerHTML = ""; } );
    li.appendChild(button);
    list.appendChild(li);
  }

  document.getElementById("stat-foe-name").innerHTML = "Name: " + currentFoe.name;
  document.getElementById("stat-foe-health").innerHTML = "Health: " + currentFoe.health + "/" + currentFoe.maxHealth;
  document.getElementById("stat-foe-stamina").innerHTML = "Stamina: " + currentFoe.stamina + "/" + currentFoe.maxStamina;
  document.getElementById("stat-foe-str").innerHTML = "Str: " + currentFoe.str;
  document.getElementById("stat-foe-dex").innerHTML = "Dex: " + currentFoe.dex;
  document.getElementById("stat-foe-con").innerHTML = "Con: " + currentFoe.con;
}

function updateDialog() {
  let list = document.getElementById("dialog");

  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < currentDialog.choices.length; i++) {
    let activated = currentDialog.choices[i].node.requirements == undefined || currentDialog.choices[i].node.requirements.reduce((result, test) => result && test(player, currentFoe), true);
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("dialog-button");
    button.innerHTML = currentDialog.choices[i].text;
    button.addEventListener("click", function() { dialogClicked(i); });
    if (!activated) {
      button.classList.add("disabled-button");
      button.disabled = true;
    }
    li.appendChild(button);
    list.appendChild(li);
  }
}

function updateDisplay() {

  document.querySelectorAll(".selector").forEach(function (x) {
    x.style.display = "none";
  });
  switch(mode) {
    case "explore":
      document.getElementById("selector-explore").style.display = "flex";
      updateExplore();
      break;
    case "combat":
      document.getElementById("selector-combat").style.display = "flex";
      updateCombat();
      break;
    case "dialog":
      document.getElementById("selector-dialog").style.display = "flex";
      updateDialog();
      break;
    case "eaten":
      document.getElementById("selector-eaten").style.display = "flex";
      updateEaten();
      break;
  }

  document.getElementById("time").innerHTML = "Time: " + renderTime(time);
  document.getElementById("date").innerHTML = "Day " + date;
  document.getElementById("stat-name").innerHTML = "Name: " + player.name;
  document.getElementById("stat-health").innerHTML = "Health: " + round(player.health,0) + "/" + round(player.maxHealth,0);
  document.getElementById("stat-cash").innerHTML = "Cash: $" + round(player.cash,0);
  document.getElementById("stat-stamina").innerHTML = "Stamina: " + round(player.stamina,0) + "/" + round(player.maxStamina,0);
  document.getElementById("stat-str").innerHTML = "Str: " + player.str;
  document.getElementById("stat-dex").innerHTML = "Dex: " + player.dex;
  document.getElementById("stat-con").innerHTML = "Con: " + player.con;
  document.getElementById("stat-arousal").innerHTML = "Arousal: " + round(player.arousal,0) + "/" + round(player.arousalLimit(),0);
  document.getElementById("stat-stomach").innerHTML = "Stomach: " + round(player.stomach.fullness(),0) + "/" + player.stomach.capacity;
  if (player.prefs.pred.anal || player.prefs.scat)
    document.getElementById("stat-bowels").innerHTML = "Bowels: " + round(player.bowels.fullness(),0) + "/" + player.bowels.capacity;
  else
    document.getElementById("stat-bowels").innerHTML = "";
  if (player.prefs.pred.cock)
    document.getElementById("stat-balls").innerHTML = "Balls: " + round(player.balls.fullness(),0) + "/" + player.balls.capacity;
  else
    document.getElementById("stat-balls").innerHTML = "";
  if (player.prefs.pred.unbirth)
    document.getElementById("stat-womb").innerHTML = "Womb: " + round(player.womb.fullness(),0) + "/" + player.womb.capacity;
  else
    document.getElementById("stat-womb").innerHTML = "";
  if (player.prefs.pred.breast)
    document.getElementById("stat-breasts").innerHTML = "Breasts: " + round(player.breasts.fullness(),0) + "/" + player.breasts.capacity;
  else
    document.getElementById("stat-breasts").innerHTML = "";

}

function advanceTimeTo(newTime, conscious=true) {
  advanceTime((86400 + newTime - time) % 86400, conscious);
}

function advanceTime(amount, conscious=true) {
  time = (time + amount);

  date += Math.floor(time / 86400);

  time = time % 86400;

  player.restoreHealth(amount);
  player.restoreStamina(amount);
  
  update(player.stomach.digest(amount));
  update(player.bowels.digest(amount));
  update(player.balls.digest(amount));
  update(player.womb.digest(amount));
  update(player.breasts.digest(amount));

  if (conscious) {
    update(player.buildArousal(amount));
  }



}

function renderTime(time) {
  let suffix = (time < 43200) ? "AM" : "PM";
  let hour = Math.floor((time % 43200) / 3600);
  if (hour == 0)
    hour = 12;
  let minute = Math.floor(time / 60) % 60;
  if (minute < 9)
    minute = "0" + minute;

  return hour + ":" + minute + " " + suffix;
}

function move(direction) {
  if (noLog)
    clearScreen();
  else
    clearLogBreak();

  let target = currentRoom.exits[direction];
  if (target == null) {
    alert("Tried to move to an empty room!");
    return;
  }

  moveTo(target,currentRoom.exitDescs[direction]);
}

function updateActions() {
  actions = [];
  currentRoom.objects.forEach(function (object) {
    object.actions.forEach(function (action) {
      if (action.conditions == undefined || action.conditions.reduce((result, cond) => result && cond(player), true))
        actions.push(action);
    });
  });

}

function moveToByName(roomName, desc="You go places lol", loading=false) {
  moveTo(world[roomName], desc, loading);
}

function moveTo(room,desc="You go places lol", loading=false) {
  currentRoom = room;

  if (!loading)
    advanceTime(30);

  update([desc,newline]);

  currentRoom.visit();

  updateDisplay();
}

function next_step(stage) {
  document.querySelector("#character-step-" + (stage - 1)).style.display = "none";
  document.querySelector("#character-step-" + stage).style.display = "block";
}

window.addEventListener('load', function(event) {
  document.getElementById("character-step-1-next").addEventListener("click", function() { next_step(2); });
  document.getElementById("character-load").addEventListener("click", startLoaded, false);
  document.getElementById("start-button").addEventListener("click", start, false);
});

function start() {
  applySettings(generateSettings());
  transformVorePrefs(player.prefs);
  document.getElementById("create").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("stat-button-status").addEventListener("click", status, false);
  document.getElementById("log-button").addEventListener("click", toggleLog, false);
  document.getElementById("load-button").addEventListener("click", loadGameButton, false);
  document.getElementById("save-button").addEventListener("click", saveGameButton, false);
  loadCompass();
  loadDialog();
  world = createWorld();
  currentRoom = world["Bedroom"];
  respawnRoom = currentRoom;
  update(new Array(50).fill(newline));
  update(["Welcome to Feast."]);
  moveTo(currentRoom,"");
  updateDisplay();
}

// copied from Stroll LUL

function generateSettings() {
  let form = document.forms.namedItem("character-form");
  let settings = {};
  for (let i=0; i<form.length; i++) {
    let value = form[i].value == "" ? form[i].placeholder : form[i].value;
    if (form[i].type == "text")
      if (form[i].value == "")
        settings[form[i].name] = form[i].placeholder;
      else
        settings[form[i].name] = value;
    else if (form[i].type == "number")
      settings[form[i].name] = parseFloat(value);
    else if (form[i].type == "checkbox") {
      settings[form[i].name] = form[i].checked;
    } else if (form[i].type == "radio") {
      let name = form[i].name;
      if (form[i].checked) {
        if (form[i].value == "true")
          settings[name] = true;
        else if (form[i].value == "false")
          settings[name] = false;
        else
          settings[name] = form[i].value;
      }

    } else if (form[i].type == "select-one") {
      settings[form[i].name] = form[i][form[i].selectedIndex].value;
    }
  }

  return settings;
}

function applySettings(settings) {
  player.name = settings.name;
  player.species = settings.species;

  for (let key in settings) {
    if (settings.hasOwnProperty(key)) {
      if (key.match(/prefs/)) {
        let tokens = key.split("-");
        let pref = player.prefs;

        // construct missing child dictionaries if needed :)

        pref = tokens.slice(1,-1).reduce(function(pref, key) {
          if (pref[key] == undefined)
            pref[key] = {};
          return pref[key];
        }, pref);
        pref[tokens.slice(-1)[0]] = settings[key];
      } else if(key.match(/parts/)) {
        let tokens = key.split("-");
        player.parts[tokens[1]] = settings[key] >= 1;

        if (player.prefs.pred == undefined)
          player.prefs.pred = {};

        player.prefs.pred[tokens[1]] = settings[key] >= 2;
      }
    }
  }
}

// turn things like "1" into a number
function transformVorePrefs(prefs) {
  let prey = false;
  for (let key in prefs.vore) {
    if (prefs.vore.hasOwnProperty(key)) {
      switch(prefs.vore[key]) {
        case "0": prefs.vore[key] = 0; break;
        case "1": prefs.vore[key] = 0.5; prey = true; break;
        case "2": prefs.vore[key] = 1; prey = true; break;
        case "3": prefs.vore[key] = 2; prey = true; break;
      }
    }
  }

  prefs.prey = prey;
  return prefs;
}

function saveSettings() {
  window.localStorage.setItem("settings", JSON.stringify(generateSettings()));
}

function retrieveSettings() {
  return JSON.parse(window.localStorage.getItem("settings"));
}

function clearScreen() {
  let log = document.getElementById("log");
  let child = log.firstChild;
  while (child != null) {
    log.removeChild(child);
    child = log.firstChild;
  }
}

function update(lines=[]) {
  let log = document.getElementById("log");


  for (let i=0; i<lines.length; i++) {
    let div = document.createElement("div");
    div.innerHTML = lines[i];

    if (logPadLine === undefined && !noLog) {
      logPadLine = div;
      logPadLine.classList.add("log-entry-padded");
    }

    log.appendChild(div);
  }


  log.scrollTop = log.scrollHeight;
  updateDisplay();
}

function clearLogBreak() {
  if (logPadLine !== undefined) {
    logPadLine.classList.remove("log-entry-padded");
    logPadLine = undefined;
  }
}

function changeMode(newMode) {
  mode = newMode;
  let body = document.querySelector("body");
  document.getElementById("foe-stats").style.display = "none";
  document.getElementById("options").style.display = "block";
  body.className = "";
  switch(mode) {
    case "explore":
    case "dialog":
      body.classList.add("explore");
      break;
    case "combat":
      body.classList.add("combat");
      document.getElementById("foe-stats").style.display = "block";
      document.getElementById("options").style.display = "none";
      break;
    case "eaten":
      body.classList.add("eaten");
        document.getElementById("options").style.display = "none";
      document.getElementById("foe-stats").style.display = "block";
      break;
  }

  updateDisplay();
}

// make it look like eaten mode, even when in combat
function changeBackground(newMode) {
  let body = document.querySelector("body");
  document.getElementById("foe-stats").style.display = "none";
  body.className = "";
  switch(newMode) {
    case "explore":
    case "dialog":
      body.classList.add("explore");
      break;
    case "combat":
      body.classList.add("combat");
      document.getElementById("foe-stats").style.display = "block";
      break;
    case "eaten":
      body.classList.add("eaten");
      document.getElementById("foe-stats").style.display = "block";
      break;
  }
}

function respawn(respawnRoom) {

  if (killingBlow.gameover == undefined) {
    if (player.prefs.prey) {
      deaths.push("Digested by " + currentFoe.description("a") + " at " + renderTime(time) + " on day " + date);
    } else {
      deaths.push("Defeated by " + currentFoe.description("a") + " at " + renderTime(time) + " on day " + date);
    }
  } else {
    deaths.push(killingBlow.gameover() + " at " + renderTime(time) + " on day " + date);
  }


  moveTo(respawnRoom,"You drift through space and time...");
  player.clear();
  player.stomach.contents = [];
  player.bowels.contents = [];
  player.bowels.waste = 0;
  player.bowels.digested = [];
  player.womb.contents = [];
  player.womb.waste = 0;
  player.womb.digested = [];
  player.balls.contents = [];
  player.balls.waste = 0;
  player.balls.digested = [];
  player.breasts.contents = [];
  player.breasts.waste = 0;
  player.breasts.digested = [];

  advanceTime(Math.floor(86400 / 2 * (Math.random() * 0.5 - 0.25 + 1)), false);
  changeMode("explore");
  player.health = 100;
  update(["You wake back up in your bed."]);
}

function startCombat(opponent) {
  currentFoe = opponent;
  changeMode("combat");
  update(opponent.startCombat(player).concat([newline]));
}

function attackClicked(index) {
  if (noLog)
    clearScreen();
  else
    clearLogBreak();
  update(playerAttacks[index].attack(currentFoe).concat([newline]));

  if (currentFoe.health <= 0) {
    currentFoe.defeated();
  } else if (mode == "combat") {
    let attack = pick(filterPriority(filterValid(currentFoe.attacks, currentFoe, player)), currentFoe, player);

    if (attack == null) {
      attack = currentFoe.backupAttack;
    }

    update(attack.attackPlayer(player).concat([newline]));

    if (player.health <= -100) {
      killingBlow = attack;
      if (currentFoe.finishCombat != undefined)
        update(currentFoe.finishCombat().concat([newline]));
      update(["You die..."]);
      respawn(respawnRoom);
    } else if (player.health <= 0) {
      update(["You're too weak to do anything..."]);
      if (player.prefs.prey) {
        // nada
      } else {
        killingBlow = attack;
        update(["You die..."]);
        respawn(respawnRoom);
      }
    }

    if (currentFoe.status != undefined) {
      let status = currentFoe.status();
      if (status.length > 0)
        update(status.concat([newline]));
    }
  }
}

function attackHovered(index) {
  document.getElementById("combat-desc").innerHTML = playerAttacks[index].desc;
}

function struggleClicked(index) {
  if (noLog)
    clearScreen();
  else
    clearLogBreak();
  let struggle = struggles[index];

  let result = struggle.struggle(player);

  update(result.lines.concat([newline]));

  if (result.escape == "stay") {
    changeMode("combat");
  } else if (result.escape == "escape") {
    changeMode("explore");
  } else {
    let digest = pick(filterValid(currentFoe.digests, currentFoe, player), currentFoe, player);

    if (digest == null) {
      digest = currentFoe.backupDigest;
    }

    update(digest.digest(player).concat([newline]));

    if (player.health <= -100) {
      killingBlow = digest;
      update(currentFoe.finishDigest().concat([newline]));
      respawn(respawnRoom);
    }
  }
}

function struggleHovered(index) {
  document.getElementById("eaten-desc").innerHTML = currentFoe.struggles[index].desc;
}

function startDialog(dialog) {
  if (noLog)
    clearScreen();
  else
    clearLogBreak();
  currentDialog = dialog;
  changeMode("dialog");
  update(currentDialog.text.concat([newline]));
  currentDialog.visit();
  updateDisplay();
}

function dialogClicked(index) {
  currentDialog = currentDialog.choices[index].node;
  update(currentDialog.text.concat([newline]));
  currentDialog.visit();
  if (currentDialog.choices.length == 0 && mode == "dialog") {
    changeMode("explore");
    updateDisplay();
  }
}

function loadDialog() {
  dialogButtons = Array.from( document.querySelectorAll(".dialog-button"));
  for (let i = 0; i < dialogButtons.length; i++) {
    dialogButtons[i].addEventListener("click", function() { dialogClicked(i); });
  }
}

function loadCompass() {
  dirButtons[NORTH_WEST] = document.getElementById("compass-north-west");
  dirButtons[NORTH_WEST].addEventListener("click", function() {
    move(NORTH_WEST);
  });
  dirButtons[NORTH] = document.getElementById("compass-north");
  dirButtons[NORTH].addEventListener("click", function() {
    move(NORTH);
  });
  dirButtons[NORTH_EAST] = document.getElementById("compass-north-east");
  dirButtons[NORTH_EAST].addEventListener("click", function() {
    move(NORTH_EAST);
  });
  dirButtons[WEST] = document.getElementById("compass-west");
  dirButtons[WEST].addEventListener("click", function() {
    move(WEST);
  });
  dirButtons[EAST] = document.getElementById("compass-east");
  dirButtons[EAST].addEventListener("click", function() {
    move(EAST);
  });
  dirButtons[SOUTH_WEST] = document.getElementById("compass-south-west");
  dirButtons[SOUTH_WEST].addEventListener("click", function() {
    move(SOUTH_WEST);
  });
  dirButtons[SOUTH] = document.getElementById("compass-south");
  dirButtons[SOUTH].addEventListener("click", function() {
    move(SOUTH);
  });
  dirButtons[SOUTH_EAST] = document.getElementById("compass-south-east");
  dirButtons[SOUTH_EAST].addEventListener("click", function() {
    move(SOUTH_EAST);
  });

  document.getElementById("compass-look").addEventListener("click", look, false);
}

function look() {
  update([currentRoom.description]);
}

function status() {
  let lines = [];

  lines.push("You are a " + player.species);

  lines.push(newline);

  if (player.stomach.contents.length > 0) {
    lines.push("Your stomach bulges with prey.");

    player.stomach.contents.map(function(prey) {
      let state = "";
      let healthRatio = prey.health / prey.maxHealth;

      if (healthRatio > 0.75) {
        state = "is thrashing in your gut";
      } else if (healthRatio > 0.5) {
        state = "is squirming in your belly";
      } else if (healthRatio > 0.25) {
        state = "is pressing out at your stomach walls";
      } else if (healthRatio > 0) {
        state = "is weakly squirming";
      } else {
        state = "has stopped moving";
      }

      lines.push(prey.description("A") + " " + state);
    });
    lines.push(newline);
  }

  if (player.bowels.contents.length > 0) {
    lines.push("Your bowels churn with prey.");

    player.bowels.contents.map(function(prey) {
      let state = "";
      let healthRatio = prey.health / prey.maxHealth;

      if (healthRatio > 0.75) {
        state = "is writhing in your bowels";
      } else if (healthRatio > 0.5) {
        state = "is struggling against your intestines";
      } else if (healthRatio > 0.25) {
        state = "is bulging out of your lower belly";
      } else if (healthRatio > 0) {
        state = "is squirming weakly, slipping deeper and deeper";
      } else {
        state = "has succumbed to your bowels";
      }

      lines.push(prey.description("A") + " " + state);
    });
    lines.push(newline);
  }

  if (player.parts.cock) {
    if (player.balls.contents.length > 0) {
      lines.push("Your balls are bulging with prey.");
      player.balls.contents.map(function(prey) {
        let state = "";
        let healthRatio = prey.health / prey.maxHealth;

        if (healthRatio > 0.75) {
          state = "is writhing in your sac";
        } else if (healthRatio > 0.5) {
          state = "is struggling in a pool of cum";
        } else if (healthRatio > 0.25) {
          state = "is starting to turn soft";
        } else if (healthRatio > 0) {
          state = "is barely visible anymore";
        } else {
          state = "has succumbed to your balls";
        }

        lines.push(prey.description("A") + " " + state);
      });
      lines.push(newline);
    } else {
      if (player.balls.waste > 0) {
        lines.push("Your balls are heavy with cum.");
        lines.push(newline);
      }
    }
  }

  if (player.parts.unbirth) {
    if (player.womb.contents.length > 0) {
      lines.push("Your slit drips, hinting at prey trapped within.");
      player.womb.contents.map(function(prey) {
        let state = "";
        let healthRatio = prey.health / prey.maxHealth;

        if (healthRatio > 0.75) {
          state = "is thrashing in your womb";
        } else if (healthRatio > 0.5) {
          state = "is pressing out inside your lower belly";
        } else if (healthRatio > 0.25) {
          state = "is still trying to escape";
        } else if (healthRatio > 0) {
          state = "is barely moving";
        } else {
          state = "is dissolving into femcum";
        }

        lines.push(prey.description("A") + " " + state);
      });
      lines.push(newline);
    } else {
      if (player.womb.waste > 0) {
        lines.push("Your slit drips, holding back a tide of femcum.");
        lines.push(newline);
      }
    }
  }

  if (player.parts.breast) {
    if (player.breasts.contents.length > 0) {
      lines.push("Your breasts are bulging with prey.");
      player.breasts.contents.map(function(prey) {
        let state = "";
        let healthRatio = prey.health / prey.maxHealth;

        if (healthRatio > 0.75) {
          state = "is struggling to escape";
        } else if (healthRatio > 0.5) {
          state = "is putting up a fight";
        } else if (healthRatio > 0.25) {
          state = "is starting to weaken";
        } else if (healthRatio > 0) {
          state = "is struggling to keep their head free of your milk";
        } else {
          state = "has succumbed, swiftly melting into milk";
        }

        lines.push(prey.description("A") + " " + state);
      });
      lines.push(newline);
    } else {
      if (player.breasts.waste > 0) {
        lines.push("Your breasts slosh with milk.");
        lines.push(newline);
      }
    }
  }




  update(lines);
}

let toSave = ["str","dex","con","name","species","health","stamina"];

function saveGame() {
  let save = {};

  save.player = {};

  save.player.str = player.str;
  save.player.dex = player.dex;
  save.player.con = player.con;
  save.player.name = player.name;
  save.player.species = player.species;
  save.player.health = player.health;
  save.player.health = player.stamina;

  save.prefs = JSON.stringify(player.prefs);

  save.position = currentRoom.name;
  save.date = date;
  save.time = time;

  save.deaths = deaths;

  let stringified = JSON.stringify(save);

  window.localStorage.setItem("save", stringified);
  update(["Game saved."]);
  updateDisplay();
}

function loadGame() {
  changeMode("explore");
  let save = JSON.parse(window.localStorage.getItem("save"));

  let playerSave = save.player;

  for (let key in playerSave) {
    if (playerSave.hasOwnProperty(key)) {
      player[key] = playerSave[key];
    }
  }

  player.prefs = JSON.parse(save.prefs);
  deaths = save.deaths;

  date = save.date;
  time = save.time;

  clearScreen();
  moveToByName(save.position, "");
  update(["Game loaded."]);
  updateDisplay();
}

function startLoaded() { //used to load the game via the main menu
  start();
  loadGame();
}

//these work in conjunction with buttonConfirm/buttonConfirmEnd and any functions that call them.
var confirmTimer; //this is areference to the active setTimeout, only used to allow clearTimeout to know thich timeout to clear
let confirmState = "";  //this records which function is asking for confirmation "" means nothing is asking for confirmation.
let confirmStateText = ""; //this is where the original button text is stored when the button reads "Confirm?"

function buttonConfirm(targetedButton, buttonText){ //starts a timer and requests the playter click the button again to confirm that they want to take the action
  if(confirmState != ""){
  buttonConfirmEnd();
  }
  document.getElementById([targetedButton]).innerHTML = "Confirm?"; //changes button text to "Confirm?"
  confirmState = targetedButton;  //copies data to global variable to make sure only one button is requesting confirmation at any given time
  confirmStateText = buttonText;  //copies data to global variable to make sure only one button is requesting confirmation at any given time
  confirmTimer = setTimeout(buttonConfirmEnd, 5000); //5000 is 5 seconds
}

function buttonConfirmEnd(){ //this resets the button once the request for confirmation has no longer active
  document.getElementById([confirmState]).innerHTML = [confirmStateText]; //resets text
  confirmState = ""; //resets confirmation state
  clearTimeout(confirmTimer); //keeps function from being called again if a timer is running
}

function saveGameButton(){//activates if the "Save Game" button is pressed
  let targetedButton = "save-button";
  if (confirmState === targetedButton){//if the confirm timer is active for this function, actually saves game
    buttonConfirmEnd();
    saveGame();
  }else{
    buttonConfirm(targetedButton, "Save Game"); //starts confirm timer for this function
  }
}

function loadGameButton(){//activates if the "Load Game" button is pressed
  let targetedButton = "load-button";
  if (confirmState === targetedButton){//if the confirm timer is active for this function, actually loads game
    buttonConfirmEnd();
    loadGame();
  }else{ //starts confirm timer for this function
    buttonConfirm(targetedButton, "Load Game");
  }
}



// wow polyfills

if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}
