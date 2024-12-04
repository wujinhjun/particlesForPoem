import p5 from 'p5';

export default class Particle {
  sketch: p5;
  location: p5.Vector;
  particleSize: number;

  color: p5.Color;

  constructor(sketch: p5) {
    this.sketch = sketch;
    this.location = this.sketch.createVector(0, 0);
    this.particleSize = 0;
    this.color = this.sketch.color(0);
  }

  display = () => {
    let currentColor = this.color;
    this.sketch.noStroke();
    this.sketch.fill(currentColor);
    this.sketch.ellipse(
      this.location.x,
      this.location.y,
      this.particleSize,
      this.particleSize,
    );
  };
}
