let walls; // array of walls
let startPos; // temporary variable used for creating walls
let collisions; // array of collision coordinates
let player;
let MAX_RAY_LENGTH;
let MINIMAP_SCALE;
let FOV;
let SCREEN_UNIT_WIDTH;
let SUBDIVISIONS; // how many rays should be cast
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  walls = [];
  collisions = [];
  MAX_RAY_LENGTH = sqrt(pow(width, 2) + pow(height, 2));
  MINIMAP_SCALE = 10; // divide everything displayed by minimap by this, 1 would mean minimap takes the whole screen
  FOV = 50;
  SCREEN_UNIT_WIDTH = width/SUBDIVISIONS;
  SUBDIVISIONS = 500;
  player = new Player(createVector(width/2, height/2), FOV, 0);
}

function draw() {
  background(255);
  detectKeys();
  drawBackground();
  render3D();
  rect(0, 0, width/MINIMAP_SCALE, height/MINIMAP_SCALE);
  displayMinimap();
  player.update();
}

function createWall(x1, y1, x2, y2) {
  walls.push({a:createVector(x1, y1),
              b:createVector(x2, y2)}); // create a new line
}

function displayMinimap() {
  //display the walls in the minimap
  walls.forEach(element => {
    line(element.a.x/MINIMAP_SCALE, element.a.y/MINIMAP_SCALE, element.b.x/MINIMAP_SCALE, element.b.y/MINIMAP_SCALE);
  });

  //display a circle every time the lines collide
  collisions.forEach(element => {
    circle(element.x, element.y, 10);
  });
  
  player.display();
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

function detectKeys() {
  //w=87, a=65, s=83, d=68
  if (keyIsDown(RIGHT_ARROW)) {
    player.direction += 2;
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.direction -= 2;
  }
  if (keyIsDown(87)) {
    player.position.y -= 5;
  }
  if (keyIsDown(65)) {
    player.position.x -= 5;
  }
  if (keyIsDown(83)) {
    player.position.y += 5;
  }
  if (keyIsDown(68)) {
    player.position.x += 5;
  }
}

function render3D() {
  //SCREEN_UNIT_WIDTH
  rectMode(CENTER);
  for (let i = 0; i < player.rays.length-2; i++) {
    push();
    noStroke();
    fill(200-(player.rays[i].size / pow(MAX_RAY_LENGTH,1/2)));
    output(200-(player.rays[i].size / pow(MAX_RAY_LENGTH,1/2)));
    rect(i * width/SUBDIVISIONS, height/2, width/SUBDIVISIONS + 1, height*(player.rays[i].size)/MAX_RAY_LENGTH);
    pop();
  }
  rectMode(CORNER);
}

function drawBackground() {
  push();
  fill(100, 255, 100);
  rect(0, height/2, width, height/2);
  fill(100, 100, 255);
  rect(0, 0, width, height/2);
  pop();
}

class Player {
  constructor(position, fov, direction) {
    this.position = position;
    this.fov = fov;
    this.direction = direction;
    this.rays = [];
  }
  
  display() {
    circle(this.position.x/MINIMAP_SCALE, this.position.y/MINIMAP_SCALE, 15);
    this.rays.forEach(element => {
      element.display();
    });
  }
  
  update() {
    this.rays = [];
    for (let i = 0; i < SUBDIVISIONS; i++) {
      let rayDirection = (this.direction-this.fov/2) + (i * (this.fov/SUBDIVISIONS));
      let closestCollision = createVector(10000, 10000);
      walls.forEach(wall => {
        let coll = collideLineLineVector(createVector(this.position.x, this.position.y), createVector(this.position.x+cos(rayDirection)*MAX_RAY_LENGTH, this.position.y+sin(rayDirection)*MAX_RAY_LENGTH), wall.a, wall.b, true);
        //circle(coll.x, coll.y, 10);
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
    this.size = distance(player.position, blockedPosition);
  }
  
  display() {
    if (distance(createVector(10000, 10000), this.blockedPosition) === 0) {
      line(player.position.x/MINIMAP_SCALE, player.position.y/MINIMAP_SCALE, (player.position.x + cos(this.direction) * MAX_RAY_LENGTH)/MINIMAP_SCALE, (player.position.y + sin(this.direction) * MAX_RAY_LENGTH)/MINIMAP_SCALE);
    }
    else {
      line(player.position.x/MINIMAP_SCALE, player.position.y/MINIMAP_SCALE, this.blockedPosition.x/MINIMAP_SCALE, this.blockedPosition.y/MINIMAP_SCALE);
    }
  }
}

function output(x1) {
  if (frameCount % 100 === 0) {
    console.log(x1);
  }
}