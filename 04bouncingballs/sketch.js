// Bouncing balls dmeo
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let balls;

function setup() {
  createCanvas(windowWidth, windowHeight);
  balls = [];
  for (let i = 0; i < 5; i++) {
    balls.push(new Ball(createVector(random(width/4, 3*width/4), random(height/4, 3*height/4)), createVector()));
  }
}

function draw() {
  background(220);
}

class Ball {
  constructor(position, velocity, diameter, colour) {
    this.position = position;
    this.velocity = velocity;
    this.diameter = diameter;
    this.colour = colour;
  }

  display() {

  }

  update() {

  }
}