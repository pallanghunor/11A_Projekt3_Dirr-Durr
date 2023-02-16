const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
var frames = 0;

let mapXStart = (canvas.width / 2) - 300;
let mapYStart = 70;
var map = Array(15).fill("0").map(() => Array(15).fill("0"));
let mapWidth = 600;
let mapHeight = 600;

var powerUps = [];
var powerUpTypes = ["bomb", "range", "speed", "shield"];
var powerUpImages = ["./img/powerUps/bomb.png", "./img/powerUps/range.png", "./img/powerUps/speed.png", "./img/powerUps/shield.png"];

{
  let player1SelectedCharachter = "01";
  let player1DownImage = new Image();
  player1DownImage.src = `./img/characters/${player1SelectedCharachter}/playerDown.png`;

  let player1UpImage = new Image();
  player1UpImage.src = `./img/characters/${player1SelectedCharachter}/playerUp.png`;

  let player1LeftImage = new Image();
  player1LeftImage.src = `./img/characters/${player1SelectedCharachter}/playerLeft.png`;

  let player1RightImage = new Image();
  player1RightImage.src = `./img/characters/${player1SelectedCharachter}/playerRight.png`;

  var player1 = new Player({
    player: 1,
    x: 5,
    y: 0,
    image: player1DownImage,
    sprites: {
      up: player1UpImage,
      left: player1LeftImage,
      right: player1RightImage,
      down: player1DownImage
    }
  });

  let player2SelectedCharachter = "01";

  let player2DownImage = new Image();
  player2DownImage.src = `./img/characters/${player2SelectedCharachter}/playerDown.png`;

  let player2UpImage = new Image();
  player2UpImage.src = `./img/characters/${player2SelectedCharachter}/playerUp.png`;

  let player2LeftImage = new Image();
  player2LeftImage.src = `./img/characters/${player2SelectedCharachter}/playerLeft.png`;

  let player2RightImage = new Image();
  player2RightImage.src = `./img/characters/${player2SelectedCharachter}/playerRight.png`;

  var player2 = new Player({
    player: 2,
    x: 565,
    y: 560,
    image: player2DownImage,
    sprites: {
      up: player2UpImage,
      left: player2LeftImage,
      right: player2RightImage,
      down: player2DownImage
    }
  });

  var bombExplosionStartImage = new Image();
  bombExplosionStartImage.src = "./img/bomb/bombExplosionStart.png";

  var bombExplosionRightImage = new Image();
  bombExplosionRightImage.src = "./img/bomb/bombExplosionRight.png";

  var bombExplosionBottomImage = new Image();
  bombExplosionBottomImage.src = "./img/bomb/bombExplosionBottom.png";

  var bombExplosionLeftImage = new Image();
  bombExplosionLeftImage.src = "./img/bomb/bombExplosionLeft.png";

  var bombExplosionTopImage = new Image();
  bombExplosionTopImage.src = "./img/bomb/bombExplosionTop.png";

  var powerUpBombImage = new Image();
  powerUpBombImage.src = "./img/powerUps/bomb.png";

  var powerUpExplosionRangeImage = new Image();
  powerUpBombImage.src = "./img/powerUps/range.png";

  var powerUpShieldImage = new Image();
  powerUpBombImage.src = "./img/powerUps/shield.png";

  var powerUpSpeedImage = new Image();
  powerUpBombImage.src = "./img/powerUps/speed.png";

  var healthImage = new Image();
  healthImage.src = "./img/health.png";

  var wallTextureImage = new Image();
  wallTextureImage.src = "./img/textures/wall.png";

  var sandTextureImage = new Image();
  sandTextureImage.src = "./img/textures/sand.png";

  var road1TextureImage = new Image();
  road1TextureImage.src = "./img/textures/road1.png";

  var road2TextureImage = new Image();
  road2TextureImage.src = "./img/textures/road2.png";

  var shieldTextureImage = new Image();
  shieldTextureImage.src = "./img/textures/shield.png";
  


  function Loading() {
    window.onload = loadImages();
    function loadImages() {
      const images = [
        player1DownImage,
        player1UpImage,
        player1LeftImage,
        player2DownImage,
        player2UpImage,
        player2LeftImage,
        player2RightImage,
        powerUpBombImage,
        powerUpExplosionRangeImage,
        powerUpShieldImage,
        powerUpSpeedImage,
        bombExplosionStartImage,
        bombExplosionRightImage,
        bombExplosionBottomImage,
        bombExplosionLeftImage,
        bombExplosionTopImage,
        powerUpBombImage,
        powerUpExplosionRangeImage,
        powerUpShieldImage,
        powerUpSpeedImage,
        healthImage,
        wallTextureImage,
        sandTextureImage,
        road1TextureImage,
        road2TextureImage,
        shieldTextureImage
      ];

      const totalImages = images.length; // Set the total number of images
      let loadedImages = 0; // Initialize the counter

      for (let i = 0; i < images.length; i++) {
        images[i].onload = loadedImages++;
      }
      if (loadedImages == totalImages) {
        init();
      }
    }
  }
}

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false,
    delay: false
  },
  arrowUp: {
    pressed: false
  },
  arrowLeft: {
    pressed: false
  },
  arrowDown: {
    pressed: false
  },
  arrowRight: {
    pressed: false
  },
  e: {
    pressed: false,
    delay: false
  }
}
Loading();


function init() {
  generateWall();
  generateSand();
  console.log(map);
  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(94, 87, 87)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawWall();
  drawMap();
  player1.updateBombs();
  player1.update();
  // player2.updateBombs();
  // player2.update();
  drawHUD();
  frames++;
} setInterval(gameLoop, 1000 / 60)

function drawHUD() {
  // Avatar
  drawAvatar();
  drawHealth();

}

function drawAvatar() {
  ctx.drawImage(player1.imageAvatar, // image source
    0, // frame width index
    0, // frame height
    (player1.image.width / 4), // frame width
    player1.image.height, // frame height
    25, // x position
    25, // y position
    100 * ((player1.image.width / 4) / player1.image.height), // width size
    100
  ); // height size
  ctx.drawImage(player2.imageAvatar,
    0,
    0,
    (player2.image.width / 4),
    player2.image.height,
    canvas.width - (100 * ((player2.image.width / 4) / player2.image.height)) - 25,
    25,
    100 * ((player2.image.width / 4) / player2.image.height),
    100
  );
}

function drawHealth() {
  // player1
  for (let i = 0; i < 3; i++) {
    if (i + 1 <= player1.health) { // full health
      ctx.drawImage(healthImage,
        0,
        0,
        healthImage.width / 2,
        healthImage.height,
        25 + 100 + ((healthImage.width / 2) * i) + (i * 10),
        25,
        40,
        40
      );
    } else {
      ctx.drawImage(healthImage,
        1 * (healthImage.width / 2),
        0,
        healthImage.width / 2,
        healthImage.height,
        25 + 100 + ((healthImage.width / 2) * i) + (i * 10),
        25,
        40,
        40
      );
    }
  }
  // player2
  for (let i = 0; i < 3; i++) {
    if (i + 1 <= player2.health) { // full health
      ctx.drawImage(healthImage,
        0,
        0,
        healthImage.width / 2,
        healthImage.height,
        canvas.width - 100 - 25 - 50 - ((healthImage.width / 2) * i) - (i * 10),
        25,
        40,
        40
      );
    } else {
      ctx.drawImage(healthImage,
        1 * (healthImage.width / 2),
        0,
        healthImage.width / 2,
        healthImage.height,
        canvas.width - 100 - 25 - 50 - ((healthImage.width / 2) * i) - (i * 10),
        25,
        40,
        40
      );
    }
  }
}

function generateWall() {
  for (let i = 1; i < 15; i++) {
    for (let j = 1; j < 15; j++) {
      if (i % 2 == 1 && j % 2 == 1) {
        map[i][j] = "wall";
      }
    }
  }
}

function isblockNextToPlayer(x, y) {
  player1X = Math.floor(player1.x / 40); // 2
  player1Y = Math.floor(player1.y / 40); // 0
  player2X = Math.floor(player2.x / 40);
  player2Y = Math.floor(player2.y / 40);
  if (x == player1X && y == player1Y || x == player1X + 1 && y == player1Y || x == player1X && y == player1Y + 1 || x == player1X - 1 && y == player1Y || x == player1X && y == player1Y - 1) {
    return true;
  }
  else if (x == player2X && y == player2Y || x == player2X - 1 && y == player2Y || x == player2X && y == player2Y - 1 || x == player2X + 1 && y == player2Y || x == player2X && y == player2Y + 1) {

    return true;
  }
}

function generateSand() {
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (Math.random() < 0.7 && !(i % 2 == 1 && j % 2 == 1)) {
        if (!isblockNextToPlayer(j, i)) {
          map[i][j] = "sand";
        }
      }
    }
  }
}

function drawWall() {
  for (let i = 0; i < 17; i++) {
    for (let j = 0; j < 17; j++) {
      ctx.drawImage(wallTextureImage, j * 40 + mapXStart - 40, i * 40 + mapYStart - 40, 40, 40)
    }
  }
}

function drawMap() {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (i % 2 == 0 && j % 2 == 0) {
        // ctx.fillStyle = "#66cc00";
        // ctx.fillRect(j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
        ctx.drawImage(road1TextureImage, j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
      } else {
        // ctx.fillStyle = "#80ff00";
        // ctx.fillRect(j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
        ctx.drawImage(road2TextureImage, j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
      }
      // ctx.drawImage(roadTextureImage, j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
      switch (map[i][j]) {
        case 'sand':
          ctx.drawImage(sandTextureImage, j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
          break;
        case 'wall':
          ctx.drawImage(wallTextureImage, j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
          break;
        case 'powerUp':
          // let position = 0;
          // let increasing = true;
          // if (frames % 10 == 0) {
          //   if (increasing) {
          //     position++;
          //     if (position == 10){
          //       increasing = false;
          //     }
          //   } else {
          //     position--;
          //     if (position == -10){
          //       increasing = true;
          //     }
          //   }
          // }
          powerUps.forEach(e => {
            if (e.powerUp.x == j && e.powerUp.y == i) {
              ctx.drawImage(e.powerUp.image, j * 40 + mapXStart + 5, i * 40 + mapYStart + 5, 30, 30);
            }
          });
        // ctx.fillStyle = "red";
        // ctx.fillRect(j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
      }
    }
  }
}

function isInsideMap(playerX, playerY, playerWidth, playerHeight) {
  const x = playerX + mapXStart;
  const y = playerY + mapYStart + 1;
  if (x < mapXStart || x + playerWidth > mapXStart + mapWidth || y + 1 < mapYStart || y + playerHeight - (playerHeight - 40) > mapYStart + mapHeight) {
    return false;
  }
  return true;
}

function isColliding(playerX, playerY, playerWidth, playerHeight, player) {
  const xStart = Math.floor(playerX / 40);
  const yStart = Math.floor((playerY + (playerHeight - 40)) / 40);
  const xEnd = Math.floor((playerX + playerWidth - 1) / 40);
  const yEnd = Math.floor((playerY + playerHeight - (playerHeight - 40) - 1) / 40);
  const block1 = {
    x: Math.floor(playerX / 40),
    y: Math.floor((playerY + (playerHeight - 40)) / 40)
  }
  const block2 = {
    x: Math.floor((playerX + playerWidth - 1) / 40),
    y: Math.floor((playerY + playerHeight - (playerHeight - 40) - 1) / 40)
  }
  if (map[yStart][xStart] == "wall" || map[yEnd][xEnd] == "wall" || map[yEnd][xStart] == "wall" || map[yStart][xEnd] == "wall") {
    return true;
  }
  else if (map[yStart][xStart] == "sand" || map[yEnd][xEnd] == "sand" || map[yEnd][xStart] == "sand" || map[yStart][xEnd] == "sand") {
    return true;
  }

  let powerUp = { x: -1, y: -1 };
  if (map[yStart][xStart] == "powerUp") {
    if (!isShieldActivated(player)) {
      powerUp.x = xStart;
      powerUp.y = yStart;
      map[yStart][xStart] = "0";
    } else if(isShieldActivated(player) && !isShield(xStart, yStart)) {
      powerUp.x = xStart;
      powerUp.y = yStart;
      map[yStart][xStart] = "0";
    }

  }
  else if (map[yEnd][xEnd] == "powerUp") {
    if (!isShieldActivated(player)) {
      powerUp.x = xEnd;
      powerUp.y = yEnd;
      map[yEnd][xEnd] = "0";
    } else if(isShieldActivated(player) && !isShield(xEnd, yEnd)) {
      powerUp.x = xEnd;
      powerUp.y = yEnd;
      map[yEnd][xEnd] = "0";
    }
  }
  else if (map[yEnd][xStart] == "powerUp") {
    if (!isShieldActivated(player)) {
      powerUp.x = xStart;
      powerUp.y = yEnd;
      map[yEnd][xStart] = "0";
    } else if (isShieldActivated(player) && !isShield(xStart, yEnd)) {
      powerUp.x = xStart;
      powerUp.y = yEnd;
      map[yEnd][xStart] = "0";
    }
  }
  else if (map[yStart][xEnd] == "powerUp") {
    if (!isShieldActivated(player)) {
      powerUp.x = xEnd;
      powerUp.y = yStart;
      map[yStart][xEnd] = "0";
    } else if(isShieldActivated(player) && !isShield(xEnd, yStart)) {
      powerUp.x = xEnd;
      powerUp.y = yStart;
      map[yStart][xEnd] = "0";
    }
  }
  if (powerUp.x != -1) {
    powerUps.forEach((e, index) => {
      if (e.powerUp.x == powerUp.x && e.powerUp.y == powerUp.y) {
        if (player == 1) {
          if (e.powerUp.type == "bomb" && player1.powerUps.bomb < 10) {
            player1.powerUps.bomb++;
            player1.bombs.push(new Bomb(player1.powerUps.range));
          }
          if (e.powerUp.type == "range" && player1.powerUps.range < 14) {
            player1.powerUps.range++;
            player1.bombs.forEach(b => {
              b.bomb.range = player1.powerUps.range;
            });
          }
          if (e.powerUp.type == "speed" && player1.powerUps.speed < 4) {
            player1.powerUps.speed++;
            player1.speed += 0.25;
          }
          if (e.powerUp.type == "shield" && !player1.powerUps.shield) {
            player1.powerUps.shield = true;
          }
        }
        else if (player == 2) {
          if (e.powerUp.type == "bomb" && player2.powerUps.bomb < 10) {
            player2.powerUps.bomb++;
            player2.bombs.push(new Bomb(player2.powerUps.range));
          }
          if (e.powerUp.type == "range" && player2.powerUps.range < 14) {
            player2.powerUps.range++;
            player2.bombs.forEach(b => {
              b.bomb.range = player2.powerUps.range;
            });
          }
          if (e.powerUp.type == "speed" && player2.powerUps.speed < 4) {
            player2.powerUps.speed++;
            player2.speed += 0.25;
          }
          if (e.powerUp.type == "shield" && !player2.powerUps.shield) {
            player2.powerUps.shield = true;
          }
        }
        powerUps.splice(index, 1);
      }
    }
    )
  }
  return false;
}

function generatePowerUp(x, y) {
  let chance = 0.5;
  let randomNumber = Math.random();
  let randomType = Math.floor(Math.random() * powerUpTypes.length);
  if (randomNumber < chance) {
      map[y][x] = "powerUp";
    powerUps.push(new PowerUp({ type: powerUpTypes[randomType], image: powerUpImages[randomType], x: x, y: y }));
  }
}

function isShieldActivated(player) {
  if (player == 1) {
    if (player1.powerUps.shield) {
      return true;
    }
  } else if (player == 2) {
    if (player2.powerUps.shield) {
      return true;
    }
  }
}

function isShield(x, y){
  for (const p of powerUps) {
    if (p.powerUp.x == x && p.powerUp.y == y && p.powerUp.type == "shield") {
      return true;
    }
  }
  return false;
}

window.addEventListener('keydown', (e) => {
  switch (e.which) {
    // player 1
    case 87:
      keys.w.pressed = true;
      break;
    case 65:
      keys.a.pressed = true;
      break;
    case 83:
      keys.s.pressed = true;
      break;
    case 68:
      keys.d.pressed = true;
      break;
    case 32:
      keys.space.pressed = true;
      break;
    // player 2
    case 38:
      keys.arrowUp.pressed = true;
      break;
    case 37:
      keys.arrowLeft.pressed = true;
      break;
    case 40:
      keys.arrowDown.pressed = true;
      break;
    case 39:
      keys.arrowRight.pressed = true;
      break;
    case 186:
      keys.e.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.which) {
    case 87:
      keys.w.pressed = false;
      break;
    case 65:
      keys.a.pressed = false;
      break;
    case 83:
      keys.s.pressed = false;
      break;
    case 68:
      keys.d.pressed = false;
      break;
    case 32:
      keys.space.pressed = false;
      break;
    case 38:
      keys.arrowUp.pressed = false;
      break;
    case 37:
      keys.arrowLeft.pressed = false;
      break;
    case 40:
      keys.arrowDown.pressed = false;
      break;
    case 39:
      keys.arrowRight.pressed = false;
      break;
    case 186:
      keys.e.pressed = false;
      break;
  }
});