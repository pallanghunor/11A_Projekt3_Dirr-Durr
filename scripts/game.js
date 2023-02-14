// BUG: Ha teljesen a bombán állsz no damage

class Player {
  constructor({ player, x, y, image, speed, sprites }) {
    this.health = 3;
    this.imageAvatar = image;
    this.image = image;
    this.sprites = sprites;
    this.frameWidth = 0;
    this.imageRatio = (this.image.width / 4) / this.image.height;
    this.playerHeight = 45;
    this.playerWidth = (43 * this.imageRatio) + 1;
    this.player = player;
    this.x = x;
    this.y = y;
    this.moving = false;
    this.animationSpeed = 10;
    this.speed = speed;

    this.bomb = new Bomb(2);
  }


  moveUp() {
    this.moving = true;
    this.image = this.sprites.up;
    if (isInsideMap(this.x, this.y - this.speed, this.playerWidth, this.playerHeight) && !isColliding(this.x, this.y - this.speed, this.playerWidth, this.playerHeight, this.player)) {
      this.y -= this.speed;
    }
  }

  moveLeft() {
    this.moving = true;
    this.image = this.sprites.left;
    if (isInsideMap(this.x - this.speed, this.y, this.playerWidth, this.playerHeight) && !isColliding(this.x - this.speed, this.y, this.playerWidth, this.playerHeight, this.player)) {
      this.x -= this.speed;
    }
  }

  moveDown() {
    this.moving = true;
    this.image = this.sprites.down;
    if (isInsideMap(this.x, this.y + this.speed, this.playerWidth, this.playerHeight) && !isColliding(this.x, this.y + this.speed, this.playerWidth, this.playerHeight, this.player)) {
      this.y += this.speed;
    }
  }

  moveRight() {
    this.moving = true;
    this.image = this.sprites.right;
    if (isInsideMap(this.x + this.speed, this.y, this.playerWidth, this.playerHeight) && !isColliding(this.x + this.speed, this.y, this.playerWidth, this.playerHeight, this.player)) {
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
    ctx.drawImage(this.image, this.frameWidth * (this.image.width / 4), 0, this.image.width / 4, this.image.height,
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
      if (keys.space.pressed && !this.bomb.bomb.placed) {
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
      if (keys.e.pressed && !this.bomb.bomb.placed) {
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
    this.player = {
      x: 0,
      y: 0,
    }
    this.bomb = {
      x: -1,
      y: -1,
      placed: false,
      explosion: false,
      timer: 3000, // milliseconds
      range: explosionRange,
      image: new Image(),
      frame: 1,
      imgFrameWidth: 0
    }
    this.bomb.image.src = './img/bomb/bomb.png';
    this.explosion = {
      start: {
        x: 0,
        y: 0,
      },
      topEnd: {
        x: 0,
        y: 0,
      },
      bottomEnd: {
        x: 0,
        y: 0,
      },
      rightEnd: {
        x: 0,
        y: 0,
      },
      leftEnd: {
        x: 0,
        y: 0,
      },
      frame: 0,
      imgFrameWidth: 0,
    }
  }

  placeBomb(playerX, playerY, playerHeight, playerWidth) {
    if (!this.bomb.placed) {
      this.bomb.placed = true;
      this.bomb.imgFrameWidth = 0;
      this.player.x = playerX;
      this.player.y = playerY + (playerHeight - 40) - 1;
      let block1X = 0;
      let block1Y = 0;
      let block2X = 0;
      let block2Y = 0;
      block1X = Math.floor(this.player.x / 40);
      block1Y = Math.floor(this.player.y / 40);
      block2X = Math.floor((this.player.x + playerWidth - 1) / 40);
      block2Y = Math.floor((this.player.y + (40 - (playerHeight - 40) - 1)) / 40);
      // console.log(playerX, playerY);
      // console.log(`player: ${this.player.x}:${this.player.y}`);
      // console.log(`block1: ${block1X}:${block1Y}`);
      // console.log(`block2: ${block2X}:${block2Y}`);
      if (block1Y == block2Y && block1X != block2X) {
        if (((block1X + 1) * 40) - this.player.x > (this.player.x + playerWidth) - (((block2X + 1) * 40) - 40)) {
          this.bomb.x = block1X;
          this.bomb.y = block1Y;
        } else {
          this.bomb.x = block2X;
          this.bomb.y = block2Y;
        }
      } else if (block1X == block2X && block1Y != block2Y) {
        if (((block1Y + 1) * 40) - this.player.y + (this.player.y / 2) > (this.player.y + (this.player.y / 2) + playerHeight) - (((block2Y + 1) * 40) - 40)) {
          this.bomb.x = block1X;
          this.bomb.y = block1Y;
        } else {
          this.bomb.x = block2X;
          this.bomb.y = block2Y;
        }
      } else {
        this.bomb.x = block1X;
        this.bomb.y = block1Y;
      }
      // console.log(this.bomb.x, this.bomb.y);
      // map[this.bomb.y][this.bomb.x] = "bomb";
      // console.log(map);
      setTimeout(() => {
        this.bombExplode();
      }, this.bomb.timer);
    }
  }

  bombExplode() {
    const player1Pos = { x: player1.x, y: player1.y };
    const player2Pos = { x: player2.x, y: player2.y };
    let p1Block1 = {
      x: Math.floor((player1Pos.x + 10) / 40),
      y: Math.floor((player1Pos.y + 10) / 40)
    };
    let p1Block2 = {
      x: Math.floor((player1Pos.x + player1.playerWidth - 1 - 10) / 40),
      y: Math.floor((player1Pos.y + player1.playerHeight - (player1.playerHeight - 40) - 1 - 10) / 40)
    };
    let p2Block1 = {
      x: Math.floor((player2Pos.x + 10) / 40),
      y: Math.floor((player2Pos.y + 10) / 40)
    };
    let p2Block2 = {
      x: Math.floor((player2Pos.x + player2.playerWidth - 1 - 10) / 40),
      y: Math.floor((player2Pos.y + player2.playerHeight - (player2.playerHeight - 40) - 1 - 10) / 40)
    };
    // console.log(`player1: ${p1Block1.x};${p1Block1.y}\t${p1Block2.x};${p1Block2.y}`);
    // console.log(`player2: ${p2Block1.x};${p2Block1.y}\t${p2Block2.x};${p2Block2.y}`);
    // console.log(`bombLeft: ${this.bombX  - 1};${this.bombY}`);
    // console.log(`bombRight: ${this.bombX + 1};${this.bombY}`);
    // console.log(`bombTop: ${this.bombX};${this.bombY - 1}`);
    // console.log(`bombBottom: ${this.bombX};${this.bombY + 1}`);
    this.explosion.start = { x: this.bomb.x, y: this.bomb.y };

    this.explosion.topEnd = { x: this.bomb.x, y: this.bomb.y };
    for (let i = 1; i <= this.bomb.range; i++) {
      if (this.bomb.y - i < 0) {
        break;
      } else {
        let topSquare = map[this.bomb.y - i][this.bomb.x];
        if (topSquare == undefined || topSquare == 'wall') {
          break;
        } else if (topSquare == 'sand') {
          map[this.bomb.y - i][this.bomb.x] = '0';
          generatePowerUp(this.bomb.x, this.bomb.y - i);
          this.explosion.topEnd = { x: this.bomb.x, y: this.bomb.y - i };
          break;
        }
        this.explosion.topEnd = { x: this.bomb.x, y: this.bomb.y - i };
        if (this.bomb.y - i == p1Block1.y && this.bomb.x == p1Block1.x || this.bomb.y - i == p1Block2.y && this.bomb.x == p1Block2.x) {
          player1.health -= 1;
          break;
        } else if (this.bomb.y - i == p2Block1.y && this.bomb.x == p2Block1.x || this.bomb.y - i == p2Block2.y && this.bomb.x == p2Block2.x) {
          player2.health -= 1;
          break;
        }
      }
    }

    this.explosion.bottomEnd = { x: this.bomb.x, y: this.bomb.y };
    for (let i = 1; i <= this.bomb.range; i++) {
      if (this.bomb.y + i > 14) {
        break;
      } else {
        let bottomSquare = map[this.bomb.y + i][this.bomb.x];
        if (bottomSquare == undefined || bottomSquare == 'wall') {
          break;
        } else if (bottomSquare == 'sand') {
          map[this.bomb.y + i][this.bomb.x] = '0';
          generatePowerUp(this.bomb.x, this.bomb.y + i);
          this.explosion.bottomEnd = { x: this.bomb.x, y: this.bomb.y + i };
          break;
        }
        this.explosion.bottomEnd = { x: this.bomb.x, y: this.bomb.y + i };
        if (this.bomb.y + i == p1Block1.y && this.bomb.x == p1Block1.x || this.bomb.y + i == p1Block2.y && this.bomb.x == p1Block2.x) {
          player1.health -= 1;
          break;
        } else if (this.bomb.y + i == p2Block1.y && this.bomb.x == p2Block1.x || this.bomb.y + i == p2Block2.y && this.bomb.x == p2Block2.x) {
          player2.health -= 1;
          break;
        }
      }
    }

    this.explosion.leftEnd = { x: this.bomb.x, y: this.bomb.y };
    for (let i = 1; i <= this.bomb.range; i++) {
      if (this.bomb.x - i < 0) {
        break;
      } else {
        let leftSquare = map[this.bomb.y][this.bomb.x - i];
        if (leftSquare == undefined || leftSquare == 'wall') {
          break;
        } else if (leftSquare == 'sand') {
          map[this.bomb.y][this.bomb.x - i] = '0';
          generatePowerUp(this.bomb.x - i, this.bomb.y);
          this.explosion.leftEnd = { x: this.bomb.x - i, y: this.bomb.y };
          break;
        }

        this.explosion.leftEnd = { x: this.bomb.x - i, y: this.bomb.y };
        if (this.bomb.y == p1Block1.y && this.bomb.x - i == p1Block1.x || this.bomb.y == p1Block2.y && this.bomb.x - i == p1Block2.x) {
          player1.health -= 1;
          break;
        } else if (this.bomb.y == p2Block1.y && this.bomb.x - i == p2Block1.x || this.bomb.y == p2Block2.y && this.bomb.x - i == p2Block2.x) {
          player2.health -= 1;
          break;
        }
      }
    }

    this.explosion.rightEnd = { x: this.bomb.x, y: this.bomb.y };
    for (let i = 1; i <= this.bomb.range; i++) {
      if (this.bomb.x + i > 14) {
        break;
      } else {
        let rightSquare = map[this.bomb.y][this.bomb.x + i];
        if (rightSquare == undefined || rightSquare == 'wall') {
          break;
        } else if (rightSquare == 'sand') {
          map[this.bomb.y][this.bomb.x + i] = '0';
          generatePowerUp(this.bomb.x + i, this.bomb.y);
          this.explosion.rightEnd = { x: this.bomb.x + i, y: this.bomb.y };
          break;
        }
        this.explosion.rightEnd = { x: this.bomb.x + i, y: this.bomb.y };
        if (this.bomb.y == p1Block1.y && this.bomb.x + i == p1Block1.x || this.bomb.y == p1Block2.y && this.bomb.x + i == p1Block2.x) {
          player1.health -= 1;
          break;
        } else if ((this.bomb.y == p2Block1.y && this.bomb.x + i == p2Block1.x) || (this.bomb.y == p2Block2.y && this.bomb.x + i == p2Block2.x)) {
          player2.health -= 1;
          break;
        }
      }
    }
    // console.log(`Start:${this.explosion.start.x}; ${this.explosion.start.y}`);
    // console.log(`TopEnd:${this.explosion.topEnd.x}; ${this.explosion.topEnd.y}`);
    // console.log(`RightEnd:${this.explosion.rightEnd.x}; ${this.explosion.rightEnd.y}`);
    // console.log(`LeftEnd:${this.explosion.leftEnd.x}; ${this.explosion.leftEnd.y}`);
    // console.log(`BottomEnd:${this.explosion.bottomEnd.x}; ${this.explosion.bottomEnd.y}`);
    // console.log(`p1: ${p1Block1.x};${p1Block1.y}`);
    // console.log(`p1: ${p1Block2.x};${p1Block2.y}`);
    // console.log(`p2: ${p2Block1.x};${p2Block1.y}`);
    // console.log(`p2: ${p2Block2.x};${p2Block2.y}`);

    this.explosion.imgFrameWidth = 0;
    this.explosion.frame = 0;
    this.bomb.explosion = true;
    // map[this.bomb.y][this.bomb.x] = '0';
    console.log(player1.health);
    console.log(player2.health);

  }

  // Start:1; 0
  // TopEnd:1; 0
  // RightEnd:2; 0
  // LeftEnd:0; 0
  // BottomEnd:1; 0

  explosionStart() {
    this.drawExplosion(bombExplosionStartImage, 0, this.explosion.start.x * 40, this.explosion.start.y * 40);
  }

  explosionTop() {
    if (this.explosion.start.y != this.explosion.topEnd.y) {
      for (let i = this.explosion.start.y - 1; i > this.explosion.topEnd.y; i--) {
        this.drawExplosion(bombExplosionTopImage, 0, this.explosion.start.x * 40, i * 40);
      }
      this.drawExplosion(bombExplosionTopImage, 1, this.explosion.topEnd.x * 40, this.explosion.topEnd.y * 40);
    }
  }

  explosionBottom() {
    if (this.explosion.start.y != this.explosion.bottomEnd.y) {
      for (let i = this.explosion.start.y + 1; i < this.explosion.bottomEnd.y; i++) {
        this.drawExplosion(bombExplosionBottomImage, 0, this.explosion.start.x * 40, i * 40);
      }
      this.drawExplosion(bombExplosionBottomImage, 1, this.explosion.bottomEnd.x * 40, this.explosion.bottomEnd.y * 40);
    }
  }

  explosionRight() {
    if (this.explosion.start.x != this.explosion.rightEnd.x) {
      for (let i = this.explosion.start.x + 1; i < this.explosion.rightEnd.x; i++) {
        this.drawExplosion(bombExplosionRightImage, 0, i * 40, this.explosion.start.y * 40);
      }
      this.drawExplosion(bombExplosionRightImage, 1, this.explosion.rightEnd.x * 40, this.explosion.rightEnd.y * 40);
    }
  }

  explosionLeft() {
    if (this.explosion.start.x != this.explosion.leftEnd.x) {
      for (let i = this.explosion.start.x - 1; i > this.explosion.leftEnd.x; i--) {
        this.drawExplosion(bombExplosionLeftImage, 0, i * 40, this.explosion.start.y * 40);
      }
      this.drawExplosion(bombExplosionLeftImage, 1, this.explosion.leftEnd.x * 40, this.explosion.leftEnd.y * 40);
    }
  }

  drawBomb() {
    ctx.drawImage(this.bomb.image,
      this.bomb.imgFrameWidth * 40,
      0,
      40,
      40,
      (this.bomb.x * 40) + mapXStart,
      (this.bomb.y * 40) + mapYStart,
      40,
      40);
  }

  drawExplosion(image, explosionFrameHeight, explosionX, explosionY) {
    ctx.drawImage(image,
      this.explosion.imgFrameWidth * 48,
      explosionFrameHeight * 48,
      48,
      48,
      explosionX + mapXStart,
      explosionY + mapYStart,
      40,
      40);
  }

  update() {
    if (this.bomb.placed == true && this.bomb.explosion == false) {
      this.bomb.frame++;
      if (this.bomb.frame % 31 == 0) {
        if (this.bomb.imgFrameWidth < 5) {
          this.bomb.imgFrameWidth++;
        }
      }
      this.drawBomb();
    }
    if (this.bomb.explosion == true) {
      this.explosion.frame++;
      if (this.explosion.frame % 4 == 0) {
        if (this.explosion.imgFrameWidth < 6) {
          this.explosion.imgFrameWidth++;
        } else if (this.explosion.imgFrameWidth == 6) {
          this.bomb.explosion = false;
          this.bomb.placed = false;
        }
      }
      this.explosionStart();
      this.explosionTop();
      this.explosionBottom();
      this.explosionRight();
      this.explosionLeft();
    }
  }
}

class PowerUp {
  constructor({type, image, x, y}) {
    this.powerUp = {
      type: type,
      image: new Image(),
      x: x,
      y: y,
    }
    this.powerUp.image.src = image; 
  }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.imageSmoothingQuality = "high";
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
var frames = 0;

let mapXStart = (canvas.width / 2) - 300;
let mapYStart = 25;
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
        bombExplosionTopImage
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
              console.log('asd');
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
  const y = playerY + mapYStart;
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
  else if (map[yStart][xStart] == "powerUp") {
    map[yStart][xStart] = "0";
  }
  else if (map[yEnd][xEnd] == "powerUp") {
    map[yEnd][xEnd] = "0";
  }
  else if (map[yEnd][xStart] == "powerUp") {
    map[yStart][xStart] = "0";
  }
  else if (map[yStart][xEnd] == "powerUp") {
    map[yEnd][xEnd] = "0";
  }
  // else if (map[yStart][xStart] == "bomb" || map[yEnd][xEnd] == "bomb" || map[yEnd][xStart] == "bomb" || map[yStart][xEnd] == "bomb") {
  //   if (map[block1.y][block1.x] == "bomb" || map[block2.y][block2.x] == "bomb"){
  //     console.log(block1.x, block1.y, block2.x, block2.y);
  //     console.log(map);
  //     return true;
  //   }
  // }
  return false;
}

function generatePowerUp(x, y) {
  let chance = 0.5;
  let randomNumber = Math.random();
  let randomType = Math.floor(Math.random() * powerUpTypes.length);
  if (randomNumber < chance) {
    map[y][x] = "powerUp";
    powerUps.push(new PowerUp({type: powerUpTypes[randomType], image: powerUpImages[randomType], x: x, y: y}));
  }
  console.log(powerUps);
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