// Terrain Genereation Perlin noise
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let time = 0;
let terrain = [];
let xOffset = 0;
let rectWidth = 10;
let generationCounter = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(255, 0, 0);
  noStroke();
}

function draw() {
  background(220);
  let x = noise(frameCount/50);
  let y = noise(frameCount/50 + 10000);
  circle(x * width, y * height, 50);

  for (let i = xOffset; i < xOffset+width/rectWidth; i++) {
    while (xOffset+width/rectWidth > terrain.length) {
      terrain.push(noise(generationCounter/100));
      generationCounter++;
    }
    rect(i * rectWidth-xOffset*rectWidth, height, rectWidth, terrain[i]*height-height);
  }

  if (keyIsDown(LEFT_ARROW)) {
    xOffset = max(0, xOffset - 1);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    xOffset++;
  }
}