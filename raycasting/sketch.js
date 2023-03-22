// line collision
// Ben
// 3/21/23
// 
// Extra for Experts:
// used collide js

let walls; // array of walls
let startPos; // temporary variable used for creating walls
let collisions; // array of collision coordinates

function setup() {
  createCanvas(windowWidth, windowHeight);
  walls = [];
  collisions = [];
  createWall(10, 10, 100, 100); // example wall
}

function draw() {
  background(220);
  display();
  updateCollision();
}

function createWall(x1, y1, x2, y2) {
  walls.push({a:createVector(x1, y1),
              b:createVector(x2, y2)}); // create a new line
}

function display() {
  //display the walls
  walls.forEach(element => {
    line(element.a.x, element.a.y, element.b.x, element.b.y);
  });

  //draw user-controlled line
  line(width/2, height/2, mouseX, mouseY);

  //display a circle every time the lines collide
  collisions.forEach(element => {
    circle(element.x, element.y, 10);
  });
}

function updateCollision() {
  collisions = [];
  walls.forEach(element => { // iterate over walls
    //calculate collision with the current wall
    let coll = collideLineLineVector(element.a, element.b, createVector(width/2, height/2), createVector(mouseX, mouseY), true);
    if (coll.x !== false) { // if there is a collision present
      collisions.push(createVector(coll.x, coll.y)); // add it to collision array
    }
  });
}

//these two functions create the following functionality:
//holding down and releasing the mouse will create a line 
//where point A is at the position where the mouse was pressed 
//and point B is the position where the mouse was released
function mousePressed() {
  startPos = createVector(mouseX, mouseY);
}

function mouseReleased() {
  createWall(startPos.x, startPos.y, mouseX, mouseY);
}