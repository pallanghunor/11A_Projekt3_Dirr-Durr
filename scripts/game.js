class Player {
  constructor(player, x, y, image, speed) {
    this.player = player;
    this.x = x * 40;
    this.y = y * 40;
    this.image = image;
    this.speed = speed;
    this.bombImage = new Image();
    this.bombImage.src = './img/dirr_durr_bomba1.png';
    this.bomb = new Bomb(3);
  }


  moveUp() {
    if (isInsideMap(this.x, this.y - this.speed) && !isColliding(this.x, this.y - this.speed)) {
      this.y -= this.speed;
    }
  }

  moveLeft() {
    if (isInsideMap(this.x - this.speed, this.y) && !isColliding(this.x - this.speed, this.y)) {
      this.x -= this.speed;
    }
  }

  moveDown() {
    if (isInsideMap(this.x, this.y + this.speed) && !isColliding(this.x, this.y + this.speed)) {
      this.y += this.speed;
    }
  }

  moveRight() {
    if (isInsideMap(this.x + this.speed, this.y) && !isColliding(this.x + this.speed, this.y)) {
      this.x += this.speed;
    }
  }

  placeBomb() {
    this.bomb.placeBomb(this.x, this.y);
  }

  draw() {
    ctx.drawImage(this.image, this.x + mapXStart, this.y);
  }

  update() {
    if (this.player == 1) {
      if (keys.w.pressed) {
        this.moveUp();
      }
      if (keys.a.pressed) {
        this.moveLeft();
      }
      if (keys.s.pressed) {
        this.moveDown();
      }
      if (keys.d.pressed) {
        this.moveRight();
      }
      if (keys.space.pressed && !this.bomb.bombPlaced) {
        this.placeBomb();
      }
    } else if (this.player == 2) {
      if (keys.arrowUp.pressed) {
        this.moveUp();
      }
      if (keys.arrowLeft.pressed) {
        this.moveLeft();
      }
      if (keys.arrowDown.pressed) {
        this.moveDown();
      }
      if (keys.arrowRight.pressed) {
        this.moveRight();
      }
      if (keys.e.pressed && !this.bomb.bombPlaced) {
        this.placeBomb();
      }
    }
    this.draw();
  }
}

class Bomb {
  constructor(explosionRange, bombImage) {
    this.x = 0;
    this.y = 0;
    this.bombPlaced = false;
    this.bombX = -1;
    this.bombY = -1;
    this.bombTimer = 3000;
    this.bombRange = explosionRange;
    this.bombImage = new Image();
    this.bombImage.src = './img/dirr_durr_bomba1.png';
  }

  placeBomb(playerX, playerY) {
    if (!this.bombPlaced) {
      this.bombPlaced = true;
      this.x = playerX;
      this.y = playerY;
      let block1X = 0;
      let block1Y = 0;
      let block2X = 0;
      let block2Y = 0;
      block1X = Math.floor(this.x / 40);
      block1Y = Math.floor(this.y / 40);
      block2X = Math.floor((this.x + 39) / 40);
      block2Y = Math.floor((this.y + 39) / 40);
      // console.log(`player: ${this.x}:${this.y}`);
      // console.log(`block1: ${block1X}:${block1Y}`);
      // console.log(`block2: ${block2X}:${block2Y}`);
      if (block1Y == block2Y && block1X != block2X) {
        if (((block1X + 1) * 40) - this.x > (this.x + 40) - (((block2X + 1) * 40) - 40)) {
          this.bombX = block1X;
          this.bombY = block1Y;
        } else {
          this.bombX = block2X;
          this.bombY = block2Y;
        }
      } else if (block1X == block2X && block1Y != block2Y) {
        if (((block1Y + 1) * 40) - this.y > (this.y + 40) - (((block2Y + 1) * 40) - 40)) {
          this.bombX = block1X;
          this.bombY = block1Y;
        } else {
          this.bombX = block2X;
          this.bombY = block2Y;
        }
      } else {
        this.bombX = block1X;
        this.bombY = block1Y;
      }
      // console.log(this.bombX, this.bombY);
      ctx.drawImage(this.bombImage, this.bombX * 40 + mapXStart, this.bombY * 40);
      setTimeout(() => {
        this.bombExplode();
      }, this.bombTimer);
    }
  }

  bombExplode(){
    for (let i = 1; i <= this.bombRange; i++) {
      if (this.bombY - i < 0) {
        break;
      } else {
        let topSquare = map[this.bombY - i][this.bombX];
        if (topSquare == undefined || topSquare == 'wall') {
          break;
        } else if (topSquare == 'sand') {
          map[this.bombY - i][this.bombX] = '0';
          break;
        }
      }
    }

    for (let i = 1; i <= this.bombRange; i++) {
      if (this.bombY + i > 14) {
        break;
      } else {
        let bottomSquare = map[this.bombY + i][this.bombX];
        if (bottomSquare == undefined || bottomSquare == 'wall') {
          break;
        } else if (bottomSquare == 'sand') {
          map[this.bombY + i][this.bombX] = '0';
          break;
        }
      }
    }

    for (let i = 1; i <= this.bombRange; i++) {
      if (this.bombX - i < 0) {
        break;
      } else {
        let leftSquare = map[this.bombY][this.bombX - i];
        if (leftSquare == undefined || leftSquare == 'wall') {
          break;
        } else if (leftSquare == 'sand'){
          map[this.bombY][this.bombX - i] = '0';
          break;
        }
      }
    }

    for (let i = 1; i <= this.bombRange; i++) {
      if (this.bombX + i > 14) {
        break;
      } else {
        let rightSquare = map[this.bombY][this.bombX + i];
        if (rightSquare == undefined || rightSquare == 'wall') {
          break;
        } else if (rightSquare == 'sand'){ 
          map[this.bombY][this.bombX + i] = '0';
          break;
        }
      }
    }
    this.bombPlaced = false;
  }

  draw(){
    ctx.drawImage(this.bombImage, (this.bombX * 40) + mapXStart, this.bombY * 40);
  }

  update(){
    if (this.bombPlaced == true) {
      this.draw();
    }
  }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

let mapXStart = (canvas.width / 2) - 300;
let mapYStart = 0;
let map = Array(15).fill("0").map(() => Array(15).fill("0"));
let mapWidth = 600;
let mapHeight = 600;


let player1Image = new Image();
player1Image.src = "./img/character.png";
let player1 = new Player(1, 0, 0, player1Image, 2);

let player2Image = new Image();
player2Image.src = "./img/character.png"
let player2 = new Player(2, 14, 14, player2Image, 2);

window.onload = init;
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
    pressed: false
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
    pressed: false
  }
}

function init() {
  generateWall();
  generateSand();
  console.log(map);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  player1.update();
  player2.update();
  player1.bomb.update();
  player2.bomb.update();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

function generateWall() {
  for (let i = 1; i < 15; i++) {
    for (let j = 1; j < 15; j++) {
      if (i % 2 == 1 && j % 2 == 1) {
        map[i][j] = "wall";
      }
    }
  }
}

function isblockNextToPlayer(i, j) {
  player2X = player2.x / 40;
  player2Y = player2.y / 40;
  if (i == player1.x && j == player1.y || i == player1.x + 1 && j == player1.y || i == player1.x && j == player1.y + 1) {
    return true;
  }
  else if (i == player2X && j == player2Y || i == player2X - 1 && j == player2Y || i == player2X && j == player2Y - 1) {
    return true;
  }
}

function generateSand() {
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (Math.random() < 0.8 && !(i % 2 == 1 && j % 2 == 1)) {
        if (!isblockNextToPlayer(i, j)) {
          map[i][j] = "sand";
        }
      }
    }
  }
}

function drawMap() {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      switch (map[i][j]) {
        case 'sand':
          ctx.fillStyle = "yellow";
          ctx.fillRect(j * 40 + mapXStart, i * 40, 40, 40);
          break;
        case 'wall':
          ctx.fillStyle = "black";
          ctx.fillRect(j * 40 + mapXStart, i * 40, 40, 40);
          break;
        case '0':
          ctx.fillStyle = "beige";
          ctx.fillRect(j * 40 + mapXStart, i * 40, 40, 40);
          break;
      }
    }
  }
}

function isInsideMap(playerX, playerY) {
  const x = playerX + mapXStart;
  const y = playerY;
  if (x < mapXStart || x + 40 > mapXStart + mapWidth || y < mapYStart || y + 40 > mapYStart + mapHeight) {
    return false;
  }
  return true;
}

function isColliding(playerX, playerY) {
  const xStart = Math.floor(playerX / 40);
  const yStart = Math.floor(playerY / 40);
  const xEnd = Math.floor((playerX + 39) / 40);
  const yEnd = Math.floor((playerY + 39) / 40);
  if (map[yStart][xStart] == "wall" || map[yEnd][xEnd] == "wall" || map[yEnd][xStart] == "wall" || map[yStart][xEnd] == "wall") {
    return true;
  }
  else if (map[yStart][xStart] == "sand" || map[yEnd][xEnd] == "sand" || map[yEnd][xStart] == "sand" || map[yStart][xEnd] == "sand") {
    return true;
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