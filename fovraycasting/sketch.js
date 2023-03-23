// Ben
// 3/21/23
// 
// Extra for Experts:
// used collide js


let walls; // array of walls
let startPos; // temporary variable used for creating walls
let collisions; // array of collision coordinates
let player;
let MAX_RAY_LENGTH;
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  walls = [];
  collisions = [];
  MAX_RAY_LENGTH = sqrt(pow(width, 2) + pow(height, 2));
  console.log(MAX_RAY_LENGTH);
  player = new Player(createVector(width/2, height/2), 60, 0);
  createWall(10, 10, 100, 100); // example wall
}

function draw() {
  background(220);
  display();
  updateCollision();
  player.update();
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

  //display a circle every time the lines collide
  collisions.forEach(element => {
    circle(element.x, element.y, 10);
  });
  
  player.display();
}

function updateCollision() {
  collisions = [];
  
}

function mousePressed() {
  startPos = createVector(mouseX, mouseY);
}

function mouseReleased() {
  createWall(startPos.x, startPos.y, mouseX, mouseY);
}

function distance(v1, v2) {
  let diffY = v1.y - v2.y;
  let diffX = v1.x - v2.x;
  return sqrt(pow(diffY, 2) + pow(diffX, 2));
}

function keyPressed() {
  if (keyCode === 65) {
    player.position.x -= 5;
  }
  
  if (keyCode === 68) {
    player.position.x += 5;
  }
  
  if (keyCode === 87) {
    player.position.y -= 5;
  }
  
  if (keyCode === 83) {
    player.position.y += 5;
  }

  if (keyCode === RIGHT_ARROW) {
    player.direction += 15;
  }

  if (keyCode === LEFT_ARROW) {
    player.direction -= 15;
  }
}

class Player {
  constructor(position, fov, direction) {
    this.position = position;
    this.fov = fov;
    this.direction = direction;
    this.rays = [];
  }
  
  display() {
    circle(this.position.x, this.position.y, 15);
    this.rays.forEach(element => {
      element.display();
    });
  }
  
  update() {
    this.rays = [];
    for (let i = 0; i < this.fov; i++) {
      let rayDirection = (this.direction-this.fov/2) + i;
      let closestCollision = createVector(10000, 10000);
      walls.forEach(wall => {
        let coll = collideLineLineVector(createVector(this.position.x, this.position.y), createVector(this.position.x+cos(rayDirection)*MAX_RAY_LENGTH, this.position.y+sin(rayDirection)*MAX_RAY_LENGTH), wall.a, wall.b, true);
        circle(coll.x, coll.y, 10);
        if (coll.x !== false) {
          if (distance(createVector(coll.x, coll.y), player.position) < distance(player.position, closestCollision)) {
            closestCollision = coll;
          }
        }
      });
      this.rays.push(new Ray(rayDirection, closestCollision));
    }
  }
}

class Ray {
  constructor(direction, blockedPosition) {
    this.direction = direction;
    this.blockedPosition = blockedPosition;
  }
  
  display() {
    if (distance(createVector(10000, 10000), this.blockedPosition) === 0) {
      line(player.position.x, player.position.y, player.position.x + cos(this.direction) * MAX_RAY_LENGTH, player.position.y + sin(this.direction) * MAX_RAY_LENGTH);
    }
    else {
      line(player.position.x, player.position.y, this.blockedPosition.x, this.blockedPosition.y);
    }
  }
}
