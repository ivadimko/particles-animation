import perlinNoise from './perlinNoise';

export default class Particle {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.kx = Math.random() * 5;
    this.ky = Math.random() * 5;

    this.size = Math.random() * 2;

    this.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
  }

  update(time, vw, vh) {
    this.x += (0.5 - perlinNoise(time, this.x / vw, this.y / vh)) * this.kx;
    this.y += (0.5 - perlinNoise(time, this.y / vh, this.x / vw)) * this.ky;
  }

  render(time, vw, vh) {
    this.update(time, vw, vh);
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
