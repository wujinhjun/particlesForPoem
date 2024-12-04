import p5 from 'p5';

export default class Particle {
  sketch: p5;
  location: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  target: p5.Vector;

  closeEnoughTarget: number;
  maxSpeed: number;
  maxForce: number;
  particleSize: number;

  startColor: p5.Color;
  targetColor: p5.Color;
  colorWeight: number;
  colorBlendRate: number;

  constructor(sketch: p5) {
    this.sketch = sketch;
    this.location = this.sketch.createVector(0, 0);
    this.velocity = this.sketch.createVector(0, 0);
    this.acceleration = this.sketch.createVector(0, 0);
    this.target = this.sketch.createVector(0, 0);

    this.closeEnoughTarget = 50;
    this.maxSpeed = 0;
    this.maxForce = 0;
    this.particleSize = 0;

    this.startColor = this.sketch.color(0);
    this.targetColor = this.sketch.color(0);
    this.colorWeight = 0;
    this.colorBlendRate = 0.025;
  }

  move = () => {
    // 计算当前位置到目标的距离
    let distanceToTarget = this.sketch.dist(
      this.location.x,
      this.location.y,
      this.target.x,
      this.target.y,
    );

    // 根据距离调整速度（距离越近，速度越慢）
    let speedAdjustment =
      distanceToTarget < this.closeEnoughTarget
        ? distanceToTarget / this.closeEnoughTarget
        : 1.0;

    // 计算理想的目标速度向量，并归一化
    const desiredVelocity = this.target
      .copy()
      .sub(this.location)
      .normalize()
      .mult(this.maxSpeed * speedAdjustment);

    // 计算引导力（steering force），限制加速度
    const steeringForce = desiredVelocity
      .sub(this.velocity)
      .limit(this.maxForce);

    // 更新加速度
    this.acceleration.add(steeringForce);

    // 更新速度和位置
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    // 清空加速度，为下一次更新做准备
    this.acceleration.mult(0);
  };

  display = () => {
    let currentColor = this.sketch.lerpColor(
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

  calcVector = (target: p5.Vector): p5.Vector => {
    const desired = target.sub(this.location);
    const desiredLength = desired.mag();

    if (desiredLength < this.closeEnoughTarget * 2) {
      desired.setMag(this.maxSpeed);
      desired.mult(-1);
      const steer = desired.sub(this.velocity);

      steer.limit(0.9);
      return steer;
    }
    return this.sketch.createVector(0, 0);
  };

  run = () => {
    this.move();
    this.display();
  };
}
