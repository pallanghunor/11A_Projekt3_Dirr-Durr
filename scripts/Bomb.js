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
        this.player.y = playerY + (playerHeight - 40);
        let block1X = 0;
        let block1Y = 0;
        let block2X = 0;
        let block2Y = 0;
        block1X = Math.floor(this.player.x / 40);
        block1Y = Math.floor(this.player.y / 40);
        block2X = Math.floor((this.player.x + playerWidth - 1) / 40);
        block2Y = Math.floor((this.player.y + (40 - (playerHeight - 40) - 1)) / 40);
        //console.log(playerX, playerY);
        //console.log(`player: ${this.player.x}:${this.player.y}`);
        //console.log(`block1: ${block1X}:${block1Y}`);
        //console.log(`block2: ${block2X}:${block2Y}`);
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
      if (this.bomb.x == p1Block1.x && this.bomb.y == p1Block1.y || this.bomb.x == p1Block2.x && this.bomb.y == p1Block2.y) {
        if (player1.powerUps.shield) {
          player1.powerUps.shield = false;
        } else {
          player1.health--;
        }
      } else if (this.bomb.x == p2Block1.x && this.bomb.y == p2Block1.y || this.bomb.x == p2Block2.x && this.bomb.y == p2Block2.y) {
        if (player2.powerUps.shield) {
          player2.powerUps.shield = false;
        } else {
          player2.health--;
        }
      } else {
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
              if (player1.powerUps.shield) {
                player1.powerUps.shield = false;
              } else {
                player1.health--;
              }
              break;
            } else if (this.bomb.y - i == p2Block1.y && this.bomb.x == p2Block1.x || this.bomb.y - i == p2Block2.y && this.bomb.x == p2Block2.x) {
              if (player2.powerUps.shield) {
                player2.powerUps.shield = false;
              } else {
                player2.health--;
              }
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
              if (player1.powerUps.shield) {
                player1.powerUps.shield = false;
              } else {
                player1.health--;
              }
              break;
            } else if (this.bomb.y + i == p2Block1.y && this.bomb.x == p2Block1.x || this.bomb.y + i == p2Block2.y && this.bomb.x == p2Block2.x) {
              if (player2.powerUps.shield) {
                player2.powerUps.shield = false;
              } else {
                player2.health--;
              }
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
              if (player1.powerUps.shield) {
                player1.powerUps.shield = false;
              } else {
                player1.health--;
              }
              break;
            } else if (this.bomb.y == p2Block1.y && this.bomb.x - i == p2Block1.x || this.bomb.y == p2Block2.y && this.bomb.x - i == p2Block2.x) {
              if (player2.powerUps.shield) {
                player2.powerUps.shield = false;
              } else {
                player2.health--;
              }
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
              if (player1.powerUps.shield) {
                player1.powerUps.shield = false;
              } else {
                player1.health--;
              }
              break;
            } else if ((this.bomb.y == p2Block1.y && this.bomb.x + i == p2Block1.x) || (this.bomb.y == p2Block2.y && this.bomb.x + i == p2Block2.x)) {
              if (player2.powerUps.shield) {
                player2.powerUps.shield = false;
              } else {
                player2.health--;
              }
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
      }
      this.explosion.imgFrameWidth = 0;
      this.explosion.frame = 0;
      this.bomb.explosion = true;
      this.bomb.placed = false;
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
            return false;
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