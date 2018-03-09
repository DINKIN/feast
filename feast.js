let currentRoom = null;
let dirButtons = [];
let mode = "explore";

let player = {
  name: "Fen",
  height: 1.55,
  health: 75,
  maxHealth: 100,
  fullness: 35,
  maxFullness: 200
};

function updateExplore() {
  for (let i = 0; i < dirButtons.length; i++) {
    let button = dirButtons[i];
    if (currentRoom.exits[i] == null) {
      button.disabled = true;
      button.classList.remove("active-compass-button");
      button.classList.add("inactive-compass-button");
      button.innerHTML = "";
    } else {
      button.disabled = false;
      button.classList.remove("inactive-compass-button");
      button.classList.add("active-compass-button");
      button.innerHTML = currentRoom.exits[i].name;
    }
  }
}

function updateCombat() {

}

function updateDisplay() {
  switch(mode) {
    case "explore":
      document.getElementById("selector-explore").style.display = "flex";
      document.getElementById("selector-combat").style.display = "none";
      updateExplore();
      break;
    case "combat":
      document.getElementById("selector-explore").style.display = "none";
      document.getElementById("selector-combat").style.display = "flex";
      updateCombat();
      break;
  }

  document.getElementById("stat-name").innerHTML = "Name: " + player.name;
  document.getElementById("stat-health").innerHTML = "Health: " + player.health + "/" + player.maxHealth;
  document.getElementById("stat-fullness").innerHTML = "Fullness: " + player.fullness + "/" + player.maxFullness;
}

function move(direction) {
  let target = currentRoom.exits[direction];
  if (target == null) {
    alert("Tried to move to an empty room!");
    return;
  } else {
    currentRoom = target;
    update(["You move to " + currentRoom.name,currentRoom.description]);
    updateDisplay();
  }
}

window.addEventListener('load', function(event) {
  loadCompass();
  currentRoom = createWorld();
  updateDisplay();
});

function update(lines=[]) {
  let log = document.getElementById("log");
  for (let i=0; i<lines.length; i++) {
    let div = document.createElement("div");
    div.innerHTML = lines[i];
    log.appendChild(div);
  }
  updateDisplay();
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
}
