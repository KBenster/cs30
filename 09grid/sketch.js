// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// let grid = [[0, 0, 1, 1],
//             [1, 1, 0, 0],
//             [0, 1, 0, 1],
//             [1, 1, 1, 1],
// ];
let grid;
const ROWS = 10;
const COLS = 100;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = createRandomGrid(ROWS, COLS);
  cellSize = min(width, height)/max(ROWS, COLS);
}

function draw() {
  background(220);
  displayGrid();
}

function displayGrid() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      fill(grid[y][x] * 255);
      square(x * cellSize, y * cellSize, cellSize);
    }
  }
}

function createRandomGrid(ROWS, COLS) {
  let newGrid = [];
  for (let i = 0; i < ROWS; i++) {
    newGrid.push([]);
    for (let j = 0; j < COLS; j++) {
      newGrid[i].push(round(random(0, 1)));
    }
  }
  return newGrid;
}

function keyTyped() {
  if (key === "r") {
    grid = createRandomGrid(ROWS, COLS);
  }
}

function mousePressed() {
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  grid[y][x] = !grid[y][x];
}