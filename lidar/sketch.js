// 3d raycasting 
// Ben
// 4/4/23
//
// Extra for Experts:
// - most of this
let triangles;
let ray;
let player;

let testRay;
let testTriangle;

const RENDER_DISTANCE = 300;
const MODE = true; //true/false for webgl/camera view
function setup() {
  if (MODE) {
    createCanvas(windowWidth, windowHeight, WEBGL);
  } else {
    createCanvas(256, 256);
  }
  triangles = [];
  triangles.push({a:createVector(0, 0, 0), //bottom left
                                b:createVector(0, 500, 0), //bottom right
                                c:createVector(500, 50, 0)});//top middle
  player = new Player(createVector(100, 100, 100), createVector(-0.5, 0, 0).normalize());


  testRay = {a:createVector(0, 100, 0), 
    b:createVector(0, 0, 0)};
  testTriangle = {a:createVector(-10, 50, -10), b:createVector(10, 50, 10), c:createVector(-10, 50, 10)};
}

function draw() {
  background(220);
  orbitControl();

  displayAxis();
  manageKeys(1/100);
  player.update();
  //player.showRays();

  lineTriangleIntersect(testRay, testTriangle);

  push();
  beginShape(LINES);
  vertex(testRay.a.x, testRay.a.y, testRay.a.z);
  vertex(testRay.b.x, testRay.b.y, testRay.b.z);
  endShape();
  pop();

  push();
  beginShape(TRIANGLES);
  vertex(testTriangle.a.x, testTriangle.a.y, testTriangle.a.z);
  vertex(testTriangle.b.x, testTriangle.b.y, testTriangle.b.z);
  vertex(testTriangle.c.x, testTriangle.c.y, testTriangle.c.z);
  endShape();
  pop();

  push();
  beginShape(TRIANGLES);
  vertex(triangles[0].a.x, triangles[0].a.y, triangles[0].a.z);
  vertex(triangles[0].b.x, triangles[0].b.y, triangles[0].b.z);
  vertex(triangles[0].c.x, triangles[0].c.y, triangles[0].c.z);
  endShape();
  pop();
}

class Player {
  constructor(pos, rot) {
    this.pos = pos;
    this.rot = rot;
    this.update();
  }

  update() {
    this.rays = [];
    for (let i = 0; i < 16; i++) {
      this.rays.push([]);
      let x = map(i, 0, 15, -1, 1);
      for (let j = 0; j < 16; j++) {
        let y = map(j, 0, 15, -1, 1);
        let rayDirection = createVector(x, y, 3).normalize();
        let angles = vectorToAngles(this.rot); // [azimuth, elevation]
        rayDirection = rotateAround(rayDirection, createVector(0, 1, 0), angles[0]); // azimuth
        //rayDirection = rotateAround(rayDirection, createVector(1, 0, 0), angles[1]); // elevation THE ISSUE IS IN HERE
        this.rays[i].push(new Ray(this.pos, rayDirection));
      }
    }
  }
  showRays() {
    for (let i = 0; i < this.rays.length; i++) {
      for (let j = 0; j < this.rays[i].length; j++) {
        this.rays[i][j].show();
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
    //output("Collide called on new ray at coordinate " + this.pos.array());
    push();
    beginShape(LINES);
    vertex(this.pos.x, this.pos.y, this.pos.z);
    vertex(endPosition.x, endPosition.y, endPosition.z);
    endShape();
    pop();
    for (let i = 0; i < triangles.length; i++) {
      let collision = lineTriangleIntersect({a:createVector(100, 100, 100), b:endPosition}, {a:triangles[i].a, b:triangles[i].b, c:triangles[i].c});
      if (collision !== false) {
        collisions.push(collision);
      }
    }

    if (collisions.length !== 0) {
      let closestCollision = collisions[0]; // we might get lucky
      collisions.forEach(coll => {
        if (vectorDist(coll, this.pos) < vectorDist(closestCollision, this.pos)) {
          closestCollision = coll;
        }
      });
      this.end = closestCollision
    } else {
      this.end = endPosition;
    }
    output("\n");
  }
  show() {
    push();
    beginShape(LINES);

    // let secondPoint = vectorMult(RENDER_DISTANCE, this.dir);
    // let endPosition = vectorAdd(this.pos, secondPoint);
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
  let p1 = triangle.a;
  let p2 = triangle.b;
  let p3 = triangle.c;

  let q1 = lineSegment.a;
  let q2 = lineSegment.b;

  if (signedVolume(q2,p1,p2,p3) === signedVolume(q1,p1,p2,p3) * -1) {
    if ((signedVolume(q1,q2,p1,p2) >= 0 === signedVolume(q1,q2,p2,p3) >= 0) && signedVolume(q1,q2,p1,p2) >= 0 === signedVolume(q1,q2,p3,p1) >= 0) {

      let N = vectorSub(p2, p1).cross(vectorSub(p3, p1));
      let t = -(vectorSub(q1, p1).dot(N))/(vectorSub(q2, q1).dot(N));
      let i = vectorAdd(q1, vectorMult(t, vectorSub(q2, q1)));

      push();
      noStroke();
      translate(i.x, i.y, i.z);
      fill(255, 0, 0);
      sphere(2);
      pop();

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