// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let boxes;
let boxSize;
function setup() {
  rectMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  boxes = [];
  boxSize = 50;

  for (let i = 0; i < 10; i++) {
    boxes.push(new Box(createVector(0, 0), i * 10, 40));
  }

  for (let i = 0; i < width/boxSize; i++) {
    for (let j = 0; j < height/boxSize; j++) {
      push();
      translate(i * boxSize, j * boxSize);
      boxes.push(new Box(createVector(0, 0), random(i * 0.01), boxSize));
    }
  }
}

function draw() {
  background(220);
  for (const box of boxes){
    box.display();
    console.log("displayed box");
  }
}

class Box {
  constructor(pos, rot, size) {
    this.pos = pos;
    this.rot = rot;
    this.size = size;
  }

  display() {
    push();
    translate(i * boxSize, j * boxSize);
    rotate(this.rot);
    square(this.pos.x, this.pos.y, this.size);
    pop();
  }
}