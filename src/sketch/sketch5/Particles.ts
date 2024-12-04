import p5 from 'p5';
import { generateRandomLocation } from '../Utils';

export default class Particle {
  sketch: p5;
  location: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  target: p5.Vector;
  mouseForce: p5.Vector;

  closeEnoughTarget: number;
  maxSpeed: number;
  maxForce: number;
  particleSize: number;
  isKilled: boolean;

  startColor: p5.Color;
  targetColor: p5.Color;
  colorWeight: number;
  colorBlendRate: number;

  constructor(sketch: p5) {
    this.sketch = sketch;
    this.location = sketch.createVector(0, 0);
    this.velocity = sketch.createVector(0, 0);
    this.acceleration = sketch.createVector(0, 0);
    this.target = sketch.createVector(0, 0);
    this.mouseForce = sketch.createVector(0, 0);

    this.closeEnoughTarget = 50;
    this.maxSpeed = 1;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;

    this.startColor = sketch.color(0);
    this.targetColor = sketch.color(255);
    this.colorWeight = 0;
    this.colorBlendRate = 0.025;
  }

  move = () => {
    const distanceToTarget = this.location.dist(this.target);
    const proximityMult =
      distanceToTarget < this.closeEnoughTarget
        ? distanceToTarget / this.closeEnoughTarget
        : 1;

    const desiredVelocity = this.target
      .copy()
      .sub(this.location)
      .normalize()
      .mult(this.maxSpeed * proximityMult);

    const steeringForce = desiredVelocity
      .sub(this.velocity)
      .limit(this.maxForce);

    steeringForce.add(this.mouseForce);

    this.acceleration.add(steeringForce);
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    this.acceleration.mult(0);
    this.mouseForce.mult(0);
  };

  display = () => {
    const currentColor = this.sketch.lerpColor(
      this.startColor,
      this.targetColor,
      this.colorWeight,
    );

    this.sketch.noStroke();
    this.sketch.fill(currentColor);
    this.sketch.ellipse(
      this.location.x,
      this.location.y,
      this.particleSize,
      this.particleSize,
    );

    if (this.colorWeight < 1.0) {
      this.colorWeight = this.sketch.min(
        this.colorWeight + this.colorBlendRate,
        1.0,
      );
    }
  };

  mouseInteract = () => {
    if (
      this.sketch.mouseX !== this.sketch.pmouseX ||
      this.sketch.mouseY !== this.sketch.pmouseY
    ) {
      this.mouseForce = this.calcVector(
        this.sketch.createVector(this.sketch.mouseX, this.sketch.mouseY),
      );
    }
  };

  calcVector = (target: p5.Vector): p5.Vector => {
    const desired = target.sub(this.location);
    const distance = desired.mag();

    if (distance < this.closeEnoughTarget * 2) {
      desired.setMag(this.maxSpeed).mult(-1); // Reverse direction
      const steer = desired.sub(this.velocity);
      steer.limit(0.9);
      return steer;
    }

    return this.sketch.createVector(0, 0);
  };

  run = () => {
    this.mouseInteract();
    this.move();
    this.display();
  };

  kill = () => {
    if (!this.isKilled) {
      const randomLocation = generateRandomLocation(
        this.sketch.width / 2,
        this.sketch.height / 2,
        (this.sketch.width + this.sketch.height) / 2,
        this.sketch,
      );

      this.target.set(randomLocation.x, randomLocation.y);
      this.startColor = this.sketch.lerpColor(
        this.startColor,
        this.targetColor,
        this.colorWeight,
      );
      this.targetColor = this.sketch.color(0); // Reset target color
      this.colorWeight = 0;
      this.isKilled = true;
    }
  };
}
