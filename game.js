const game = document.getElementById("game");

const player1 = document.getElementById("player1");
const player1X = 0;
const player1Y = 0;
let player1Range = 3;

const player2 = document.getElementById("player2");
const player2X = 14;
const player2Y = 14;
let player2Range = 1;

let squares;
let lastTime = 0; // variable to keep track of the time of the last frame
let moving = false;



// Függvények
function generateMap() {
  // Generate squares with coordinates
  for (let i = 0; i <= 14; i++) {
    for (let j = 0; j <= 14; j++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("data-x", i);
      square.setAttribute("data-y", j);
      square.style.top = (i * 40) + "px";
      square.style.left = (j * 40) + "px";
      // square.textContent = `(${i}, ${j})`;
      game.appendChild(square);
    }
  }
  squares = document.querySelectorAll(".square");
}

function generateWall() {
  // Generate walls
  for (let i = 1; i < 15; i++) {
    for (let j = 1; j < 15; j++) {
      const square = squares[i * 15 + j];
      if (!square) continue; // skip if square is null or undefined
      if (i % 2 == 1 && j % 2 == 1) {
        square.classList.add("wall"); // add "wall" class
      }
    }
  }
}

function removeSand(playerX, playerY) {
  // Don't generate sand next to player
  for (let i = playerX - 1; i <= playerX + 1; i++) {
    for (let j = playerY - 1; j <= playerY + 1; j++) {
      const square = squares[i * 15 + j];
      if (!square) continue; // skip if square is null or undefined
      square.classList.remove("sand");
    }
  }
}

function generateSand() {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < 0.8 && !squares[i].classList.contains("wall")) {
      squares[i].classList.add("sand");
    }
  }
}

function movePlayer(player, direction) {
  // Get the current position of the player
  let playerTop = player.offsetTop;
  let playerLeft = player.offsetLeft;

  // Update the position based on the direction
  if (direction == "up") {
    playerTop -= 40;
  } else if (direction == "down") {
    playerTop += 40;
  } else if (direction == "left") {
    playerLeft -= 40;
  } else if (direction == "right") {
    playerLeft += 40;
  }

  // Check if the new position of the player would collide with a wall or go out of bounds
  let collidesWithWall = false;
  let walls = document.querySelectorAll(".wall");
  let sands = document.querySelectorAll(".sand");
  walls.forEach(function (wall) {
    if (playerLeft + player.offsetWidth > wall.offsetLeft &&
      playerLeft < wall.offsetLeft + wall.offsetWidth &&
      playerTop + player.offsetHeight > wall.offsetTop &&
      playerTop < wall.offsetTop + wall.offsetHeight) {
      collidesWithWall = true;
    }
  });
  sands.forEach(function (sand) {
    if (playerLeft + player.offsetWidth > sand.offsetLeft &&
      playerLeft < sand.offsetLeft + sand.offsetWidth &&
      playerTop + player.offsetHeight > sand.offsetTop &&
      playerTop < sand.offsetTop + sand.offsetHeight) {
      collidesWithWall = true;
    }
  });

  if (playerLeft < 0 || playerLeft + player.offsetWidth > game.offsetWidth ||
    playerTop < 0 || playerTop + player.offsetHeight > game.offsetHeight) {
    collidesWithWall = true;
  }

  // Only update the player's position if there is no collision
  if (!collidesWithWall) {
    player.style.top = playerTop + "px";
    player.style.left = playerLeft + "px";
  }
}

function placeBomb(player, explosionRange) {
  let playerTop = player.offsetTop;
  let playerLeft = player.offsetLeft;

  let bomb = document.createElement('div');
  bomb.classList.add('bomb');
  bomb.style.top = playerTop + 'px';
  bomb.style.left = playerLeft + 'px';
  bomb.dataset.x = Math.floor(playerTop / 40);
  bomb.dataset.y = Math.floor(playerLeft / 40);
  game.appendChild(bomb);

  // After 3 seconds, explode the bomb
  setTimeout(function () {
    explodeBomb(bomb, explosionRange);
  }, 3000);
}

function explodeBomb(bomb, explosionRange) {
  bomb.remove();

  // Get the position of the bomb
  let bombX = parseInt(bomb.dataset.x);
  let bombY = parseInt(bomb.dataset.y);


  
  // Get the coordinates of the squares next to the bomb
  let squaresToRemove = [];
  for (let i = 1; i <= parseInt(explosionRange); i++) {
    let topBlocked = false;
    let bottomBlocked = false;
    let leftBlocked = false;
    let rightBlocked = false;
    for (let j = 1; j <= i; j++) {
      let topSquare = document.querySelector(`[data-x='${bombX}'][data-y='${bombY - j}']`);
      if (topSquare && topSquare.classList.contains('wall')) {
        topBlocked = true;
      }
      let bottomSquare = document.querySelector(`[data-x='${bombX}'][data-y='${bombY + j}']`);
      if (bottomSquare && bottomSquare.classList.contains('wall')) {
        bottomBlocked = true;
      }
      let leftSquare = document.querySelector(`[data-x='${bombX - j}'][data-y='${bombY}']`);
      if (leftSquare && leftSquare.classList.contains('wall')) {
        leftBlocked = true;
      }
      let rightSquare = document.querySelector(`[data-x='${bombX + j}'][data-y='${bombY}']`);
      if (rightSquare && rightSquare.classList.contains('wall')) {
        rightBlocked = true;
      }
    }
    if (!topBlocked) {
      squaresToRemove.push([bombX, bombY - i]); // square above the bomb
    }
    if (!bottomBlocked) {
      squaresToRemove.push([bombX, bombY + i]); // square below the bomb
    }
    if (!leftBlocked) {
      squaresToRemove.push([bombX - i, bombY]); // square to the left of the bomb
    }
    if (!rightBlocked) {
      squaresToRemove.push([bombX + i, bombY]); // square to the right of the bomb
    }


    // Remove the sand from the squares next to the bomb
    squaresToRemove.forEach(function (coords) {
      let square = document.querySelector(`[data-x='${coords[0]}'][data-y='${coords[1]}']`);
      if (square && square.classList.contains('sand') && !square.classList.contains('wall')) {
        square.classList.remove('sand');
      }
    });
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key == "w") {
    moving = true;
    movePlayer(player1, "up");
  } else if (event.key == "a") {
    moving = true;
    movePlayer(player1, "left");
  } else if (event.key == "s") {
    moving = true;
    movePlayer(player1, "down");
  } else if (event.key == "d") {
    moving = true;
    movePlayer(player1, "right");
  } else if (event.key == "ArrowUp") {
    moving = true;
    movePlayer(player2, "up");
  } else if (event.key == "ArrowLeft") {
    moving = true;
    movePlayer(player2, "left");
  } else if (event.key == "ArrowDown") {
    moving = true;
    movePlayer(player2, "down");
  } else if (event.key == "ArrowRight") {
    moving = true;
    movePlayer(player2, "right");
  } else if (event.code == 'Space') {
    placeBomb(player1, player1Range);
  } else if (event.key == "j") {
    placeBomb(player2, player2Range);
  }

});


// Főprogram
generateMap();
generateWall();
generateSand();
removeSand(player1X, player1Y);
removeSand(player2X, player2Y);

