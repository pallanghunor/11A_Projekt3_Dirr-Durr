class PowerUp {
    constructor({ type, image, x, y }) {
      this.powerUp = {
        type: type,
        image: new Image(),
        x: x,
        y: y,
      }
      this.powerUp.image.src = image;
    }
  }