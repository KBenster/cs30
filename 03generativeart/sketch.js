// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
}
// they have cleaning chemicals that they use to clean like the deep fryers and stuff
// dumbass maintenance guy didnt wash out the cleaning chemicals when refilling the deep fryers with oil
// for the past 2 weeks everyone has been eating carcinogenic toxic fries and chicken
function draw() {
  background(220);
  drawLines(500, 500);
}

function drawLines(rows, cols) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let spaceAmount = width/cols;
      diagonalLine(i * spaceAmount, j * spaceAmount, spaceAmount);
    }
  }
}

function diagonalLine(x, y, spacing) {
  if (random(100) > 50) {
    // positive slope
    line(x - spacing/2, y + spacing/2, x + spacing/2, y - spacing/2);
  }
  else {
    //negative slope
    line(x - spacing/2, y - spacing/2, x + spacing/2, y + spacing/2);
  }
}