class Player {
    constructor({ player, x, y, image, sprites }) {

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
        this.animationSpeed = 8;
        this.health = 3;
        this.speed = 2.5;
        this.powerUps = {
            bomb: 1, // level
            range: 1,
            shield: false,
            shieldDuration: 10, // sec
            speed: 1,
        }
        this.bombplaced = 0;
        this.bombs = [new Bomb(this.powerUps.range)];
        this.shield = {
            timer: this.powerUps.shieldDuration * 60,
            flashing: false,
            flashcounter: 0
        }
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
        for (let i = 0; i < this.bombs.length; i++) {
            if (!this.bombs[i].bomb.placed) {
                this.bombs[i].placeBomb(this.x, this.y, this.playerHeight, this.playerWidth);
                this.bombs[i].bomb.placed = true;
                return;
            }
        }
    }

    keypressDelay() {
        if (this.player == 1) {
            keys.space.delay = true;
            setTimeout(() => {
                keys.space.delay = false;
            }, 250);
        } else if (this.player == 2) {
            keys.e.delay = true;
            setTimeout(() => {
                keys.e.delay = false;
            }, 250);
        }
    }

    updateBombs() {
        this.bombs.forEach(b => {
            b.update();
        });
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

    drawShield(){
        ctx.drawImage(shieldTextureImage, this.x + mapXStart - (this.playerWidth / 4), this.y + mapYStart - this.playerHeight + 40 - 2, 50, 50);
    }

    update() {
        if (this.health == 0) {
            GameEnd = true;
            if (this.player == 1) {
                winner = 2;
            } else {
                winner = 1;
            }
        }
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
            if (keys.space.pressed && this.bombplaced < this.powerUps.bomb && !keys.space.delay) {
                this.placeBomb();
                this.keypressDelay();
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
            if (keys.e.pressed && this.bombplaced < this.powerUps.bomb && !keys.e.delay) {
                this.placeBomb();
                this.keypressDelay();
            }
            if (!keys.arrowUp.pressed && !keys.arrowLeft.pressed && !keys.arrowDown.pressed && !keys.arrowRight.pressed) {
                this.moving = false;
            }
        }
        
        this.draw();
        if (this.powerUps.shield) {
            this.shield.timer--;
            if (this.shield.timer < 2 * 60){
                this.shield.flashing = true;
                if (this.shield.flashcounter >= 30) {
                    this.shield.flashcounter = 0;
                } else {
                    this.shield.flashcounter++;
                }
            }
            if (this.shield.timer <= 0) {
                this.powerUps.shield = false;
            }
            if (this.shield.flashing && this.shield.flashcounter % 60 < 15) {
                this.drawShield();
            } else if (!this.shield.flashing) {
                this.drawShield();
            }
        } else {
            this.shield.timer = this.powerUps.shieldDuration * 60;
            this.shield.flashing = false;
        }
    }
}