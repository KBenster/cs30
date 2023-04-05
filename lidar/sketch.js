// 3d raycasting 
// Ben
// 4/4/23
//
// Extra for Experts:
// - most of this
let triangles;
let ray;
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  triangles = [];
  triangles.push(createTriangle(createVector(0, 0, 0), //bottom left
                                createVector(0, 100, 0), //bottom right
                                createVector(50, 50, 0)));//top middle
  ray = {a: createVector(20, 50, -100), b:createVector(50, 50, 100)};
  console.log(lineTriangleIntersect(ray, triangles[0]));
}

function draw() {
  background(220);
  orbitControl();
  line(ray.a.x, ray.a.y, ray.a.z, ray.b.x, ray.b.y, ray.b.z);
  beginShape();
  vertex(triangles[0].a.x, triangles[0].a.y, triangles[0].a.z);
  vertex(triangles[0].b.x, triangles[0].b.y, triangles[0].b.z);
  vertex(triangles[0].c.x, triangles[0].c.y, triangles[0].c.z);
  endShape(CLOSE);
}

function createTriangle(p1, p2, p3) {
  return {a:p1,
          b:p2,
          c:p3};
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
  
    return (1.0/6.0)*(d.sub(a).dot((b.sub(a)).cross(c.sub(a))));
}

function lineTriangleIntersect(lineSegment, triangle) {
  let p1 = triangle.a;
  let p2 = triangle.b;
  let p3 = triangle.c;

  let q1 = lineSegment.a;
  let q2 = lineSegment.b;
  //console.log(signedVolume(q1,p1,p2,p3) + " " + signedVolume(q1,p1,p2,p3));
  if (signedVolume(q1,p1,p2,p3) !== signedVolume(q1,p1,p2,p3)) {
    console.log("aaaaa");
    if (signedVolume(q1,q2,p1,p2) === signedVolume(q1,q2,p2,p3) && signedVolume(q1,q2,p2,p3) === signedVolume(q1,q2,p3,p1)) {
      return true;
    }
  }

  return false;
}

