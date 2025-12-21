class Sprite {
  constructor(imgSrc, frameWidth, frameHeight, frameCount, speed = 8) {
    this.image = new Image();
    this.image.src = imgSrc;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.speed = speed;

    this.frameIndex = 0;
    this.tick = 0;
  }

  draw(ctx, x, y, size) {
    this.tick++;
    if (this.tick > this.speed) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.tick = 0;
    }

    ctx.drawImage(
      this.image,
      this.frameIndex * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      size,
      size
    );
  }
}
