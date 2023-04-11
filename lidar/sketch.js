// 3d raycasting 
// Ben
// 4/4/23
//
// Extra for Experts:
// - most of this
let triangles;
let player;

const RENDER_DISTANCE = 500; // maximum ray distance
const RENDER_QUALITY = 60; //number of rays cast; square this number to get the total number of rays
const MODE = true; //true/false for webgl/camera view
function setup() {
  if (MODE) {
    createCanvas(windowWidth, windowHeight, WEBGL);
  } else {
    createCanvas(RENDER_QUALITY*8, RENDER_QUALITY*8);
  }
  triangles = [];
  triangles.push({a:createVector(0, 0, 0), //bottom left
                                b:createVector(0, 100, 0), //bottom right
                                c:createVector(50, 100, 0)});//top middle 
  triangles.push({a:createVector(100, 100, 100), //bottom left
                                b:createVector(0, 200, 0), //bottom right
                                c:createVector(100, 00, 0)});//top middle


  player = new Player(createVector(358, 100, -160), createVector(0.5639, 0, -0.8257).normalize());
}

function draw() {
  output(frameRate());
  background(220);
  if(MODE){
    orbitControl();
  }

  displayAxis();
  
  manageKeys(1/100);
  player.update();
  player.showRays();

  if(MODE){ // if we're in 3d viewing mode
    triangles.forEach(triangle => { // draw the triangles
      push();
      beginShape(TRIANGLES);
      vertex(triangle.a.x, triangle.a.y, triangle.a.z);
      vertex(triangle.b.x, triangle.b.y, triangle.b.z);
      vertex(triangle.c.x, triangle.c.y, triangle.c.z);
      endShape();
      pop();
    });
  }
}

class Player {
  constructor(pos, rot) {
    this.pos = pos;
    this.rot = rot;
    this.initializeRays(); // cast new rays
  }


  initializeRays() {
    this.rays = [];
    for (let i = 0; i < RENDER_QUALITY; i++) {
      this.rays.push([]);
      let x = map(i, 0, RENDER_QUALITY-1, -1, 1);
      for (let j = 0; j < RENDER_QUALITY; j++) {
        let y = map(j, 0, RENDER_QUALITY-1, -1, 1);
        let rayDirection = createVector(x, y, 3).normalize(); // the fov will remain the same regardless of the render quality
        let angles = vectorToAngles(this.rot); // [azimuth, elevation]
        rayDirection = rotateAround(rayDirection, createVector(0, 1, 0), angles[0]); // azimuth
        //rayDirection = rotateAround(rayDirection, createVector(1, 0, 0), angles[1]); // elevation THE ISSUE IS IN HERE
        this.rays[i].push(new Ray(this.pos, rayDirection));
      }
    }
  }

  update() {
    for (let i = 0; i < this.rays.length; i++) {
      let x = map(i, 0, RENDER_QUALITY-1, -1, 1);
      for (let j = 0; j < this.rays[i].length; j++) {
        let y = map(j, 0, RENDER_QUALITY-1, -1, 1);
        let rayDirection = createVector(x, y, 3).normalize(); // the fov will remain the same regardless of the render quality
        let angles = vectorToAngles(this.rot); // [azimuth, elevation]
        rayDirection = rotateAround(rayDirection, createVector(0, 1, 0), angles[0]); // azimuth
        //rayDirection = rotateAround(rayDirection, createVector(1, 0, 0), angles[1]); // elevation THE ISSUE IS IN HERE
        this.rays[i][j].pos = this.pos;
        this.rays[i][j].dir = rayDirection;
        this.rays[i][j].collide();
      }
    }
  }

  showRays() { // iterate over every ray, draw the square representing what the ray sees
    for (let i = this.rays.length-1; i > 0; i--) {
      for (let j = this.rays.length-1; j > 0; j--) {
        push();
        noStroke();
        fill(map(vectorDist(this.rays[i][j].pos, this.rays[i][j].end), 0, RENDER_DISTANCE, 0, 255));
        square(i*8, j*8, 8);
        pop();
        //this.rays[i][j].show(); // draw the centermost ray
        
      }
    }
  }

  setRot(r) {
    this.rot = r.copy();
  }
}

class Ray {
  constructor(pos, dir) {
    this.pos = pos;
    this.dir = dir;
    this.dir.normalize();
    this.end = null;
    this.collide();
  }
  collide() {
    let collisions = [];
    let endPosition = vectorAdd(this.pos, vectorMult(RENDER_DISTANCE, this.dir));
    for (let i = 0; i < triangles.length; i++) {
      // this collision variable will either be a vector of the collision or false for no collision
      let collision = lineTriangleIntersect({a:this.pos, b:endPosition}, {a:triangles[i].c, b:triangles[i].b, c:triangles[i].a});
      if (collision !== false) {
        collisions.push(collision);
      }
    }

    if (collisions.length !== 0) {
      let closestCollision = collisions[0];
      collisions.forEach(coll => {
        if (vectorDist(coll, this.pos) < vectorDist(closestCollision, this.pos)) {
          closestCollision = coll;
        }
      });
      this.end = closestCollision
    } else {
      this.end = endPosition;
    }
  }
  show() {
    push();
    beginShape(LINES);
    vertex(this.pos.x, this.pos.y, this.pos.z);
    vertex(this.end.x, this.end.y, this.end.z);
    endShape();
    pop();
  }
  
  setPos(p) {
    this.pos = p.copy();
  }

  setRot(r) {
    this.rot = r.copy();
  }
}

function createTriangle(p1, p2, p3) {
  return {a:p1,
          b:p2,
          c:p3};
}

function manageKeys(speed) {

  //rotations
  let angles = vectorToAngles(player.rot)
  if (keyIsDown(LEFT_ARROW)) {
    angles[0] += speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    angles[0] -= speed;
  }
  if (keyIsDown(UP_ARROW)) {
    angles[1] += speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    angles[1] -= speed;
  }
  
  player.rot = vectorFromAngles(angles[1], angles[0]);


  //positions
  if (keyIsDown(87)) {
    player.pos.x += sin(vectorToAngles(player.rot)[0]) * speed * 150;
    player.pos.z += cos(vectorToAngles(player.rot)[0]) * speed * 150;
  }
  if (keyIsDown(65)) {
    player.pos.x += cos(vectorToAngles(player.rot)[0]) * speed * 150;
    player.pos.z -= sin(vectorToAngles(player.rot)[0]) * speed * 150;
  }
  if (keyIsDown(83)) {
    player.pos.x -= sin(vectorToAngles(player.rot)[0]) * speed * 150;
    player.pos.z -= cos(vectorToAngles(player.rot)[0]) * speed * 150;
  }
  if (keyIsDown(68)) {
    player.pos.x -= cos(vectorToAngles(player.rot)[0]) * speed * 150;
    player.pos.z += sin(vectorToAngles(player.rot)[0]) * speed * 150;
  }
}

function signedVolume(a, b, c, d) {
  //a, b, c, d are all vectors
  //https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
  //https://math.stackexchange.com/questions/2841269/how-to-find-the-volume-of-a-tetrahedron
  //essentially, when a = 0
  //a, b and c are given by a scalar triple product.
  //Volume = (1/6) * |v1 ⋅ (v2 x v3)|
  
  //if it's a 3x3 matrix Δ whos ith column equals to vi, the above formula becomes
  //volume = (1/6) * |det Δ|
  
  //we are subtracting a from b, c, d because the above formula assumes that a or v1 is zero.
  //SignedVolume(a,b,c,d) = (1.0/6.0)*dot(cross(b-a,c-a),d-a)
  
  return 1.0/6.0 * vectorSub(d, a).dot(vectorSub(b, a).cross(vectorSub(c, a)));
}

function lineTriangleIntersect(lineSegment, triangle) {
  //checks the sign

  let p1 = triangle.a;
  let p2 = triangle.b;
  let p3 = triangle.c;

  let q1 = lineSegment.a;
  let q2 = lineSegment.b;
  
  if (signedVolume(q2,p1,p2,p3) >= 0 === (signedVolume(q1,p1,p2,p3) * -1) >= 0) {
    if ((signedVolume(q1,q2,p1,p2) >= 0 === signedVolume(q1,q2,p2,p3) >= 0) && signedVolume(q1,q2,p1,p2) >= 0 === signedVolume(q1,q2,p3,p1) >= 0) {

      let N = vectorSub(p2, p1).cross(vectorSub(p3, p1));
      let t = -(vectorSub(q1, p1).dot(N))/(vectorSub(q2, q1).dot(N));
      let i = vectorAdd(q1, vectorMult(t, vectorSub(q2, q1)));

      // push();
      // noStroke();
      // translate(i.x, i.y, i.z);
      // fill(255, 0, 0);
      // sphere(2);
      // pop();

      return i;
    }
  }

  return false;
}


function vectorAdd(a, b) {
  return createVector(a.x + b.x, a.y + b.y, a.z + b.z);
}

function vectorSub(a, b) {
  return createVector(a.x - b.x, a.y - b.y, a.z - b.z);
}

function vectorMult(a, b) { // a would be a scalar hypothetically
  let vect = b.copy();
  return vect.mult(a);
}

//https://stackoverflow.com/questions/67458592/how-would-i-rotate-a-vector-in-3d-space-p5-js
function rotateAround(vect, axis, angle) { // show me someone more brain damaged than me and ill give you a million dollars
  // Make sure our axis is a unit vector
  axis = p5.Vector.normalize(axis);

  return p5.Vector.add(
    p5.Vector.mult(vect, cos(angle)),
    p5.Vector.add(
      p5.Vector.mult(
        p5.Vector.cross(axis, vect),
        sin(angle)
      ),
      p5.Vector.mult(
        p5.Vector.mult(
          axis,
          p5.Vector.dot(axis, vect)
        ),
        (1 - cos(angle))
      )
    )
  );
}

function vectorSetHeading(v, az, el) {
  // for 2d vectors, do this
  // vector.rotate(-vector.heading());
  // vector.rotate(direction);

  vect = v.copy();
  const x = sin(el) * cos(az);
  const y = sin(el) * sin(az);
  const z = cos(el);

  const cosAz = cos(az);
  const sinAz = sin(az);
  const azimuthMatrix = [
    [cosAz, -sinAz, 0],
    [sinAz, cosAz, 0],
    [0, 0, 1]
  ];
  const cosEl = cos(el);
  const sinEl = sin(el);
  const elevationMatrix = [
    [cosEl, 0, sinEl],
    [0, 1, 0],
    [-sinEl, 0, cosEl]
  ];

  const rotationMatrix = matrixMult(azimuthMatrix, elevationMatrix);
  
  return matrixMult([v.array()], rotationMatrix);
}

function matrixMult(a, b) {
  let aNumRows = a.length;
  let bNumRows = b.length;
  let aNumCols = a[0].length;
  let bNumCols = b[0].length;

  if (aNumCols !== bNumRows) {
    console.log("matrixMult function: Cannot multiply matrices, dimensions do not match");
    return null;
  }

  m = [];
  for (let r = 0; r < aNumRows; r++) {
    m.push([]);
    for (let c = 0; c < bNumCols; c++) {
      let sum = 0;
      for (let k = 0; k < aNumCols; k++) {
        sum += a[r][k] * b[k][c];
      }
      m[r].push(sum);
    }
  }

  return m;
}

function displayAxis() {
  push();
  beginShape(LINES);
  stroke(255, 0, 0);
  vertex(0, 0, 0);
  vertex(300, 0, 0);
  endShape();
  pop();

  push();
  beginShape(LINES);
  stroke(0, 255, 0);
  vertex(0, 0, 0);
  vertex(0, 300, 0);
  endShape();
  pop();

  push();
  beginShape(LINES);
  stroke(0, 0, 255);
  vertex(0, 0, 0);
  vertex(0, 0, 300);
  endShape();
  pop();
}

function output(a) {
  if (frameCount % 100 === 0) {
    console.log(a);
  }
}

function vectorFromAngles(elevation, phi) {
  let v = createVector();

  v.x = cos(phi);
  v.z = sin(phi);
  v.y = -1 * sqrt(pow(v.x, 2) + pow(v.z, 2)) * tan(elevation);

  v.normalize();
  return v;
}

function vectorToAngles(v) {
  let azimuth = atan2(v.z, v.x);
  let elevation = atan2(sqrt(v.x * v.x + v.z * v.z), v.y);
  return [azimuth, elevation]
}

function vectorDist(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return sqrt(pow(dx, 2) + pow(dy, 2));
}