// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let bubbles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < 10; i++) {
    spawnBubble();
  }
  window.setInterval(spawnBubble, 500);
}

function draw() {
  //background(255);
  updateBubbles();
  drawBubbles();
}

function spawnBubble() {
  let bubble = {
    x: random(width),
    y:random(height),
    colour: color(random(255), random(255), random(255), random(255)),
    size: random(5, 50),
    time: 0,
    seed: random(10000)
  };
  bubbles.push(bubble);
}

function drawBubbles() {
  for (const bubble of bubbles) {
    fill(bubble.colour);
    circle(bubble.x, bubble.y, bubble.size);
  }
}

function updateBubbles() {
  for (const bubble of bubbles) {
    bubble.time += 1/100;
    bubble.x = noise(bubble.time + bubble.seed) * width;
    bubble.y = noise(bubble.time + bubble.seed+500) * height;
  }
}