function vectorToWorldSpace(vec, agentHeading, agentSide) {
  var matTransform = createRotationMatr(agentHeading, agentSide);

  // Transform vertices
  var res = transformVector2Ds(matTransform, vec);
  return res;
}

function pointToLocalSpace(obstacle, agentHeading, agentSide, agentPos) {
  var tX = -dotProduct(agentPos, agentHeading);
  var tY = -dotProduct(agentPos, agentSide);

  // Transformation matrix
  var matTransform = [
    [agentHeading.x, agentSide.x],
    [agentHeading.y, agentSide.y],
    [tX, tY]
  ];
  var transPoint = transformVector2Ds(matTransform, { x: obstacle.x, y: obstacle.y });

  return transPoint;
}

function createRotationMatr(fwd, side) {
  //create a rotation matrix from a 2D vector
  var identityMatr = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  var rotMatr = [
    [fwd.x, fwd.y, 0],
    [side.x, side.y, 0],
    [0, 0, 1]
  ];

  return matrMultiply(identityMatr, rotMatr);
}

function matrMultiply(m1, m2) {
  var result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  result[0][0] = (m1[0][0] * m2[0][0]) + (m1[0][1] * m2[1][0]) + (m1[0][2] * m2[2][0]);
  result[0][1] = (m1[0][0] * m2[0][1]) + (m1[0][1] * m2[1][1]) + (m1[0][2] * m2[2][1]);
  result[0][2] = (m1[0][0] * m2[0][2]) + (m1[0][1] * m2[1][2]) + (m1[0][2] * m2[2][2]);

  result[1][0] = (m1[1][0] * m2[0][0]) + (m1[1][1] * m2[1][0]) + (m1[1][2] * m2[2][0]);
  result[1][1] = (m1[1][0] * m2[0][1]) + (m1[1][1] * m2[1][1]) + (m1[1][2] * m2[2][1]);
  result[1][2] = (m1[1][0] * m2[0][2]) + (m1[1][1] * m2[1][2]) + (m1[1][2] * m2[2][2]);

  result[2][0] = (m1[2][0] * m2[0][0]) + (m1[2][1] * m2[1][0]) + (m1[2][2] * m2[2][0]);
  result[2][1] = (m1[2][0] * m2[0][1]) + (m1[2][1] * m2[1][1]) + (m1[2][2] * m2[2][1]);
  result[2][2] = (m1[2][0] * m2[0][2]) + (m1[2][1] * m2[1][2]) + (m1[2][2] * m2[2][2]);

  return result;
}

function transformVector2Ds(matr, point) {
  var pointX = (matr[0][0] * point.x) + (matr[1][0] * point.y) + matr[2][0];
  var pointY = (matr[0][1] * point.x) + (matr[1][1] * point.y) + matr[2][1];

  return { x: pointX, y: pointY };
}

function dotProduct(vec1, vec2) {
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

function perpendicular(x, y) {
  return { x: -y, y: x };
}

function distanceSquared(x1, y1, x2, y2) {
  return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
}

function lengthSquared(x, y) {
  return (x*x + y*y);
}

function vecLength(x, y) {
  return Math.sqrt(x*x + y*y);
}

function normalize(x, y) {
  if (x === 0 && y === 0) {
    return { x: 0, y: 0 };
  }
  var len = vecLength(x, y);
  return {
    x: x / len,
    y: y / len
  }
}
