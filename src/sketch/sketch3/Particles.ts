import p5 from 'p5';

export default class Particle {
  sketch: p5;
  location: p5.Vector;
  target: p5.Vector;
  speed: number;

  closeEnoughTarget: number;
  particleSize: number;

  color: p5.Color;

  constructor(sketch: p5) {
    this.sketch = sketch;
    this.location = this.sketch.createVector(0, 0);
    this.target = this.sketch.createVector(0, 0);

    this.speed = 0.05;

    this.closeEnoughTarget = 50;
    this.particleSize = 0;

    this.color = this.sketch.color(0);
  }

  //   move = () => {
  //     this.location.lerp(this.target, 0.1);
  //   };

  move = () => {
    const xShift =
      this.location.x + (this.target.x - this.location.x) * this.speed;
    const yShift =
      this.location.y + (this.target.y - this.location.y) * this.speed;
    this.location.set(xShift, yShift);
  };

  display = () => {
    this.sketch.noStroke();
    this.sketch.fill(this.color);
    this.sketch.ellipse(
      this.location.x,
      this.location.y,
      this.particleSize,
      this.particleSize,
    );
  };

  run = () => {
    this.move();
    this.display();
  };
}
