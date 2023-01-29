class Player {
  constructor(x, y, image, speed){
    this.x = x;
    this.y = y;
    this.image = image;
    this.speed = speed;
    this.bombPlaced = false;
    this.bombX = -1;
    this.bombY = -1;
    this.bombRadius = 100;
    this.bombTimer = 3000;
  }


  moveUp(){
    if (isInsideMap(this.x, this.y - this.speed) && !isColliding(this.x, this.y - this.speed)) {
      this.y -= this.speed;
    }
  }

  moveLeft(){
    if (isInsideMap(this.x - this.speed, this.y) && !isColliding(this.x - this.speed, this.y)) {
      this.x -= this.speed;
    }
  }

  moveDown(){
    if (isInsideMap(this.x, this.y + this.speed) && !isColliding(this.x, this.y + this.speed)) {
      this.y += this.speed;
    }
  }

  moveRight(){
    if (isInsideMap(this.x + this.speed, this.y) && !isColliding(this.x + this.speed, this.y)) {
      this.x += this.speed;
    }
  }

  placeBomb(){
    if (!this.bombPlaced) {
      let block1X = 0;
      let block1Y = 0;
      let block2X = 0;
      let block2Y = 0;
      block1X = Math.floor(this.x / 40);
      block1Y = Math.floor(this.y / 40);
      block2X = Math.floor((this.x + 39) / 40);
      block2Y = Math.floor((this.y + 39) / 40);
      console.log(`player: ${this.x}:${this.y}`);
      console.log(`block1: ${block1X}:${block1Y}`);
      console.log(`block2: ${block2X}:${block2Y}`);
      if (block1Y == block2Y && block1X != block2X) {
        if (((block1X + 1)* 40) - this.x > (this.x + 40) - (((block2X + 1)* 40) - 40)) {
          this.bombX = block1X;
          this.bombY = block1Y;
        } else {
          this.bombX = block2X;
          this.bombY = block2Y;
        }
      } else if(block1X == block2X && block1Y != block2Y) {
        if (((block1Y + 1)* 40) - this.y > (this.y + 40) - (((block2Y + 1)* 40) - 40)) {
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
      console.log(this.bombX, this.bombY);
      // this.bombPlaced = true;
      setTimeout(() => {
      }, this.bombTimer);
    }
  }

  bombExplode() {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        let distance = Math.sqrt(Math.pow(i - this.bombX, 2) + Math.pow(j - this.bombY, 2));
        if (distance <= this.bombRadius) {
          map[i][j] = "0";
        }
      }
    }
    this.bombPlaced = false;
  }

  draw(){
    ctx.drawImage(this.image, this.x + mapXStart, this.y);
  }

  update() {
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
    if (keys.space.pressed && !this.bombPlaced) {
      this.placeBomb();
    }
    this.draw();
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
let player1 = new Player(0, 0, player1Image, 1);

let player2Image = new Image();
player2Image.src = "./img/character.png"
let player2 = new Player(14, 14, player2Image, 1);

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

function isblockNextToPlayer(i, j){
  if (i == player1.x && j == player1.y || i == player1.x + 1 && j == player1.y || i == player1.x && j == player1.y + 1) {
    return true;
  }
  else if (i == player2.x && j == player2.y || i == player2.x - 1 && j == player2.y || i == player2.x && j == player2.y - 1) {
    return true;
  }
}

function generateSand() {
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (Math.random() < 0.8 && !(i % 2 == 1 && j % 2 == 1)) {
        if (!isblockNextToPlayer(i, j)){
          map[i][j] = "sand";
        }
      }
    }
  }
}

function drawMap(){
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        switch (map[i][j]) {
          case 'sand':
            ctx.fillStyle = "yellow";
            ctx.fillRect(j * 40 + mapXStart, i * 40, 40, 40);
            break;
          case 'wall':
            ctx.fillStyle = "black";
            ctx.fillRect(j * 40 + mapXStart , i * 40, 40, 40);
            break;
          case '0':
            ctx.fillStyle = "beige";
            ctx.fillRect(j * 40 + mapXStart, i * 40, 40, 40);
            break;
        }
    }
}
}

function isInsideMap(playerX, playerY){
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
  else if (map[yStart][xStart] == "sand" || map[yEnd][xEnd] == "sand" || map[yEnd][xStart] == "sand" || map[yStart][xEnd] == "sand"){
    return false;
  }
  return false;
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      break;
    case 'a':
      keys.a.pressed = true;
      break;
    case 's':
      keys.s.pressed = true;
      break;
    case 'd':
      keys.d.pressed = true;
      break;
    case ' ':
      keys.space.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case ' ':
      keys.space.pressed = false;
      break;
  }
});