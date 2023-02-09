class Player {
  constructor({ player, x, y, image, speed, sprites }) {
    this.health = 3; 
    this.image = image;
    this.sprites = sprites;
    this.frameWidth = 0;
    this.playerWidth = this.image.width / 4;
    this.playerHeight = this.image.height;
    this.player = player;
    this.x = x;
    this.y = y;
    this.moving = false;
    this.animationSpeed = 10;
    this.speed = speed;
    this.bomb = new Bomb(1);
  }


  moveUp() {
    this.moving = true;
    this.image = this.sprites.up;
    if (isInsideMap(this.x, this.y - this.speed, this.playerWidth, this.playerHeight) && !isColliding(this.x, this.y - this.speed, this.playerWidth, this.playerHeight)) {
      this.y -= this.speed;
    }
  }

  moveLeft() {
    this.moving = true;
    this.image = this.sprites.left;
    if (isInsideMap(this.x - this.speed, this.y, this.playerWidth, this.playerHeight) && !isColliding(this.x - this.speed, this.y, this.playerWidth, this.playerHeight)) {
      this.x -= this.speed;
    }
  }

  moveDown() {
    this.moving = true;
    this.image = this.sprites.down;
    if (isInsideMap(this.x, this.y + this.speed, this.playerWidth, this.playerHeight) && !isColliding(this.x, this.y + this.speed, this.playerWidth, this.playerHeight)) {
      this.y += this.speed;
    }
  }

  moveRight() {
    this.moving = true;
    this.image = this.sprites.right;
    if (isInsideMap(this.x + this.speed, this.y, this.playerWidth, this.playerHeight) && !isColliding(this.x + this.speed, this.y, this.playerWidth, this.playerHeight)) {
      this.x += this.speed;
    }
  }

  placeBomb() {
    this.bomb.placeBomb(this.x, this.y, this.playerHeight, this.playerWidth);
  }

  draw() {
    if (this.moving) {
      if (frames % this.animationSpeed == 0) {
        if (this.frameWidth < 3) {
          this.frameWidth++;
        } else {
          this.frameWidth = 0;
        }
      }
    }
    ctx.drawImage(this.image, this.frameWidth * this.playerWidth, 0, this.playerWidth, this.playerHeight,
      this.x + mapXStart, this.y + mapYStart - this.playerHeight + 40,
      this.playerWidth, this.playerHeight);

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
      if (!keys.w.pressed && !keys.a.pressed && !keys.s.pressed && !keys.d.pressed) {
        this.moving = false;
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
      if (!keys.arrowUp.pressed && !keys.arrowLeft.pressed && !keys.arrowDown.pressed && !keys.arrowRight.pressed) {
        this.moving = false;
      }
    }
    this.draw();
  }
}

class Bomb {
  constructor(explosionRange) {
    this.x = 0;
    this.y = 0;
    this.bombPlaced = false;
    this.bombX = -1;
    this.bombY = -1;
    this.bombTimer = 3000;
    this.bombRange = explosionRange;
    this.bombImage = new Image();
    this.bombImage.src = './img/bomb.png';
    this.frameWidth = 5;
  }

  placeBomb(playerX, playerY, playerHeight, playerWidth) {
    if (!this.bombPlaced) {
      this.bombPlaced = true;
      this.frameWidth = 0;
      this.x = playerX;
      this.y = playerY;
      let block1X = 0;
      let block1Y = 0;
      let block2X = 0;
      let block2Y = 0;
      block1X = Math.floor(this.x / 40);
      block1Y = Math.floor(this.y / 40);
      block2X = Math.floor((this.x + playerWidth - 1) / 40);
      block2Y = Math.floor((this.y + playerHeight - (playerHeight - 40) - 1) / 40);
      // console.log(playerX, playerY);
      // console.log(`player: ${this.x}:${this.y}`);
      // console.log(`block1: ${block1X}:${block1Y}`);
      // console.log(`block2: ${block2X}:${block2Y}`);
      if (block1Y == block2Y && block1X != block2X) {
        if (((block1X + 1) * 40) - this.x > (this.x + playerWidth) - (((block2X + 1) * 40) - 40)) {
          this.bombX = block1X;
          this.bombY = block1Y;
        } else {
          this.bombX = block2X;
          this.bombY = block2Y;
        }
      } else if (block1X == block2X && block1Y != block2Y) {
        if (((block1Y + 1) * 40) - this.y > (this.y + playerHeight) - (((block2Y + 1) * 40) - 40)) {
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
      setTimeout(() => {
        this.bombExplode();
      }, this.bombTimer);
    }
  }

  bombExplode() {
    const player1Pos = {x: player1.x, y: player1.y};
    const player2Pos = {x: player2.x, y: player2.y};
    let p1Block1 = {x: Math.floor(player1Pos.x / 40), y: Math.floor(player1Pos.y / 40)};
    let p1Block2 = {x: Math.floor((player1Pos.x + player1.playerWidth - 1) / 40), y: Math.floor((player1Pos.y + player1.playerHeight - (player1.playerHeight - 40) - 1) / 40)};
    let p2Block1 = {x: Math.floor(player2Pos.x / 40), y: Math.floor(player2Pos.y / 40)};
    let p2Block2 = {x: Math.floor((player2Pos.x + player2.playerWidth - 1) / 40), y: Math.floor((player2Pos.y + player2.playerHeight - (player2.playerHeight - 40) - 1) / 40)};
    console.log(`player1: ${p1Block1.x};${p1Block1.y}\t${p1Block2.x};${p1Block2.y}`);
    console.log(`player2: ${p2Block1.x};${p2Block1.y}\t${p2Block2.x};${p2Block2.y}`);
    console.log(`bombLeft: ${this.bombX  - 1};${this.bombY}`);
    console.log(`bombRight: ${this.bombX + 1};${this.bombY}`);
    console.log(`bombTop: ${this.bombX};${this.bombY - 1}`);
    console.log(`bombBottom: ${this.bombX};${this.bombY + 1}`);

    let explosionUpStart = {x: this.bombX, y: this.bombY};
    let explosionUpEnd = {x: this.bombX, y: this.bombY};
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
        explosionUpEnd = {x: this.bombX, y: this.bombY - i};
        if (this.bombY - i == p1Block1.y && this.bombX == p1Block1.x || this.bombY - i == p1Block2.y && this.bombX == p1Block2.x){
          player1.health -= 1;
          break;
        } else if (this.bombY - i == p2Block1.y && this.bombX == p2Block1.x || this.bombY - i == p2Block2.y && this.bombX == p2Block2.x){
          player2.health -= 1;
          break;
        }
      }
    }

    let explosionBottomStart = {x: this.bombX, y: this.bombY};
    let explosionBottomEnd = {x: this.bombX, y: this.bombY};
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
        
        explosionBottomEnd = {x: this.bombX, y: this.bombY + i};
        if (this.bombY + i == p1Block1.y && this.bombX == p1Block1.x || this.bombY + i == p1Block2.y && this.bombX == p1Block2.x){
          player1.health -= 1;
          break;
        } else if (this.bombY + i == p2Block1.y && this.bombX == p2Block1.x || this.bombY + i == p2Block2.y && this.bombX == p2Block2.x){
          player2.health -= 1;
          break;
        }
      }
    }

    let explosionLeftStart = {x: this.bombX, y: this.bombY};
    let explosionLeftEnd = {x: this.bombX, y: this.bombY};
    for (let i = 1; i <= this.bombRange; i++) {
      if (this.bombX - i < 0) {
        break;
      } else {
        let leftSquare = map[this.bombY][this.bombX - i];
        if (leftSquare == undefined || leftSquare == 'wall') {
          break;
        } else if (leftSquare == 'sand') {
          map[this.bombY][this.bombX - i] = '0';
          break;
        }
        
        explosionLeftEnd = {x: this.bombX - i, y: this.bombY};
        if (this.bombY == p1Block1.y && this.bombX - 1 == p1Block1.x || this.bombY == p1Block2.y && this.bombX - 1 == p1Block2.x){
          player1.health -= 1;
          break;
        } else if (this.bombY == p2Block1.y && this.bombX - 1 == p2Block1.x || this.bombY == p2Block2.y && this.bombX - 1 == p2Block2.x){
          player2.health -= 1;
          break;
        }
      }
    }

    let explosionRightStart = {x: this.bombX, y: this.bombY};
    let explosionRightEnd = {x: this.bombX, y: this.bombY};
    for (let i = 1; i <= this.bombRange; i++) {
      if (this.bombX + i > 14) {
        break;
      } else {
        let rightSquare = map[this.bombY][this.bombX + i];
        if (rightSquare == undefined || rightSquare == 'wall') {
          break;
        } else if (rightSquare == 'sand') {
          map[this.bombY][this.bombX + i] = '0';
          break;
        }
        
        explosionRightEnd = {x: this.bombX + i, y: this.bombY};
        if (this.bombY == p1Block1.y && this.bombX + 1 == p1Block1.x || this.bombY == p1Block2.y && this.bombX + 1 == p1Block2.x){
          player1.health -= 1;
          break;
        } else if (this.bombY == p2Block1.y && this.bombX + 1 == p2Block1.x || this.bombY == p2Block2.y && this.bombX + 1 == p2Block2.x){
          player2.health -= 1;
          break;
        }
      }
    }
    console.log(`player1: ${player1.health}\nplayer2: ${player2.health}`);
    this.bombPlaced = false;
  }

  draw() {
    ctx.drawImage(this.bombImage,
      this.frameWidth * 40,
      0,
      40,
      40,
      (this.bombX * 40) + mapXStart,
      (this.bombY * 40) + mapYStart,
      40,
      40);
  }

  update() {
    if (this.bombPlaced == true) {
      if (frames % 30 == 0) {
        if (this.frameWidth < 5) {
          this.frameWidth++;
        }
      }
      this.draw();
    }
  }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
let frames = 0;

let mapXStart = (canvas.width / 2) - 300;
let mapYStart = 20;
let map = Array(15).fill("0").map(() => Array(15).fill("0"));
let mapWidth = 600;
let mapHeight = 600;

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
    speed: 2,
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
    speed: 2,
    sprites: {
      up: player2UpImage,
      left: player2LeftImage,
      right: player2RightImage,
      down: player2DownImage
    }
  });

  function Loading() {
    window.onload;
    player1DownImage.onload;
    player1UpImage.onload;
    player1DownImage.onload;
    player1LeftImage.onload;
  
    player2DownImage.onload;
    player2UpImage.onload;
    player2LeftImage.onload;
    player2RightImage.onload;
    init();
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
Loading();


function init() {
  generateWall();
  generateSand();
  console.log(map);
  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  player1.bomb.update();
  player1.update();
  player2.bomb.update();
  player2.update();
  frames++;
} setInterval(gameLoop, 1000 / 60)

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
      if (Math.random() < 0.8 && !(i % 2 == 1 && j % 2 == 1)) {
        if (!isblockNextToPlayer(j, i)) {
          map[i][j] = "sand";
        }
      }
    }
  }
}

function drawMap() {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      ctx.fillStyle = "beige";
      ctx.fillRect(j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
      switch (map[i][j]) {
        case 'sand':
          ctx.fillStyle = "yellow";
          ctx.fillRect(j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
          break;
        case 'wall':
          ctx.fillStyle = "black";
          ctx.fillRect(j * 40 + mapXStart, i * 40 + mapYStart, 40, 40);
          break;
      }
    }
  }
}

function isInsideMap(playerX, playerY, playerWidth, playerHeight) {
  const x = playerX + mapXStart;
  const y = playerY + mapYStart;
  if (x < mapXStart || x + playerWidth > mapXStart + mapWidth || y +1  < mapYStart || y + playerHeight - (playerHeight - 40) > mapYStart + mapHeight) {
    return false;
  }
  return true;
}

function isColliding(playerX, playerY, playerWidth, playerHeight) {
  const xStart = Math.floor(playerX / 40);
  const yStart = Math.floor((playerY + (playerHeight - 40)) / 40);
  const xEnd = Math.floor((playerX + playerWidth - 1) / 40);
  const yEnd = Math.floor((playerY + playerHeight - (playerHeight - 40) - 1) / 40);
  const block1X = Math.floor(playerX / 40);
  const block1Y = Math.floor(playerY / 40);
  const block2X = Math.floor((playerX + playerWidth - 1) / 40);
  const block2Y = Math.floor((playerY + playerHeight - (playerHeight - 40) - 1) / 40);
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