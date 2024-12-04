import p5 from "p5";
import { generateRandomLocation } from "./Utils";

export default class Particle {
    sketch: p5
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
        this.location = this.sketch.createVector(0, 0);
        this.velocity = this.sketch.createVector(0, 0);
        this.acceleration = this.sketch.createVector(0, 0);
        this.target = this.sketch.createVector(0, 0);
        this.mouseForce = this.sketch.createVector(0, 0);

        this.closeEnoughTarget = 50;
        this.maxSpeed = 0;
        this.maxForce = 0;
        this.particleSize = 0;
        this.isKilled = false;

        this.startColor = this.sketch.color(0);
        this.targetColor = this.sketch.color(0);
        this.colorWeight = 0;
        this.colorBlendRate = 0.025;
    }

    move = () => {
        let proximityMult = 1.0;
        let distance = this.sketch.dist(this.location.x, this.location.y, this.target.x, this.target.y);
        if (distance < this.closeEnoughTarget) {
            proximityMult = distance / this.closeEnoughTarget;
        }

        // calculate the direction to target point
        const towardsTarget: p5.Vector = this.sketch.createVector(this.target.x, this.target.y);
        towardsTarget.sub(this.location);
        towardsTarget.normalize();
        towardsTarget.mult(this.maxSpeed * proximityMult);

        // if the point has velocity
        // by this operation can change the direction of velocity

        // towardsTarget.sub(this.velocity);
        // towardsTarget.normalize();
        // towardsTarget.mult(this.maxForce);
        const steer: p5.Vector = this.sketch.createVector(towardsTarget.x, towardsTarget.y);
        steer.sub(this.velocity);
        steer.normalize();
        steer.mult(this.maxForce);

        // console.log(steer.mag());

        // apply force
        steer.add(this.mouseForce);
        this.acceleration.add(steer);
        // this.acceleration.add(this.mouseForce);

        // apply acceleration
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
        this.mouseForce.mult(0);
    }

    display = () => {
        let currentColor = this.sketch.lerpColor(this.startColor, this.targetColor, this.colorWeight);
        this.sketch.noStroke();
        this.sketch.fill(currentColor);
        this.sketch.ellipse(this.location.x, this.location.y, this.particleSize, this.particleSize);

        if (this.colorWeight < 1.0) {
            this.colorWeight = this.sketch.min(this.colorWeight + this.colorBlendRate, 1.0);
        }
    }

    mouseInteract = () => {
        const previousMouseX: number = this.sketch.pmouseX;
        const previousMouseY: number = this.sketch.pmouseY;

        const currentMouseX: number = this.sketch.mouseX;
        const currentMouseY: number = this.sketch.mouseY;

        if (previousMouseX !== currentMouseX || previousMouseY !== currentMouseY) {
            const mouse = this.sketch.createVector(currentMouseX, currentMouseY);
            this.mouseForce = this.calcVector(mouse);
            // console.log(this.mouseForce);
        }
    }

    calcVector = (target: p5.Vector): p5.Vector => {
        const desired = target.sub(this.location);
        const desiredLength = desired.mag();

        if (desiredLength < this.closeEnoughTarget * 2) {
            desired.setMag(this.maxSpeed);
            desired.mult(-1);
            const steer = desired.sub(this.velocity);
            // desired.mult(0);

            steer.limit(0.9);
            // console.log(`steer: ${steer.mag()}`);
            return steer;
        }
        return this.sketch.createVector(0, 0);
    }

    run = () => {
        this.mouseInteract();
        this.move();
        this.display();
    }

    kill = () => {
        if (!this.isKilled) {
            let randomLocation = generateRandomLocation(this.sketch.width / 2, this.sketch.height / 2, (this.sketch.width + this.sketch.height) / 2, this.sketch);
            this.target.x = randomLocation.x;
            this.target.y = randomLocation.y;

            this.startColor = this.sketch.lerpColor(this.startColor, this.targetColor, this.colorWeight);
            this.targetColor = this.sketch.color(0);
            this.colorWeight = 0;

            this.isKilled = true;
        }
    }
}
