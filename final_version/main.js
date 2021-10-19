var canvas;
var ctx;
var secondsPassed;
var oldTimeStamp;

var DEBUG_MODE = true;

// Obstacle avoidance params
var MIN_DETECTION_BOX_LEN = 40; // 40 by default
// Used for debugging
var DETECTION_BOX_LEN = 0;
var AGENT_HEADING = { x: 0, y: 0 };

// Circles variables
var circleRadius = 10;
var maxCircles = 30;
var existingCircles = [];
var BAD = 1;
var GOOD = 2;
var AT_LEAST_ONE_GOOD = false;
// end Circles variables

// Vehicle object
var vehicle = {
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  velocity: {
    x: 0,
    y: 0
  },
  acceleration: {
    x: 0,
    y: 0
  },
  mass: 1,
  maxSpeed: 50,
  maxAcceleration: 50,
  rotation: 0,
  // Approximate radius for obstacle avoidance
  radius: 10,
  collidedWithGood: 0,
  collidedWithBad: 0
};
// end Vehicle object

// Listen to the onLoad event
window.onload = init;

// Trigger init function when the page has loaded
function init() {
  canvas = document.getElementById('ai');
  ctx = canvas.getContext('2d');

  if (!DEBUG_MODE) {
    vehicle.x = randFromTo(20, canvas.width - 20);
    vehicle.y = randFromTo(20, canvas.height - 20);
  }

  vehicle.x = 41;
  vehicle.y = 24;
  existingCircles.push({
    x: 109,
    y: 28,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  existingCircles.push({
    x: 125,
    y: 63,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  existingCircles.push({
    x: 140,
    y: 97,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  existingCircles.push({
    x: 86,
    y: 24,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  existingCircles.push({
    x: 158,
    y: 156,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  // Second row
  existingCircles.push({
    x: 228,
    y: 137,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  existingCircles.push({
    x: 270,
    y: 100,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  existingCircles.push({
    x: 305,
    y: 113,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });
  existingCircles.push({
    x: 307,
    y: 131,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: BAD
  });

  existingCircles.push({
    x: canvas.width/2 + 100,
    y: canvas.height/2,
    lifetime: 1000,
    tStart: 0,
    radius: 10,
    type: GOOD
  });

  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {

  // Calculate the number of seconds passed since the last frame
  oldTimeStamp ||= 0; // First frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;


  // Perform the drawing operation
  draw(timeStamp, secondsPassed);

  // The loop function has reached it's end
  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function draw(timeStamp, secondsFromLastFrame) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var ts = timeStamp / 1000;

  updateVehicle(secondsFromLastFrame);
  drawVehicle(ts);
  // if (DEBUG_MODE) {
    drawDetectionBox();
  // }
  drawCircles(ts);
  collisionDetection();
}

function updateVehicle(ts) {
  var target = findClosestCircle();

  if (!target.x && !target.y) {
    return;
  }

  var angle = Math.atan2(AGENT_HEADING.y, AGENT_HEADING.x);
  vehicle.rotation = angle;

  var seekForce = seek(target.x, target.y);
  var obstacleAvoidanceForce = obstacleAvoidance();
  var forceSum = { x: seekForce.x + obstacleAvoidanceForce.x, y: seekForce.y + obstacleAvoidanceForce.y };

  vehicle.force = forceSum;
  vehicle.acceleration.x = vehicle.force.x / vehicle.mass;
  vehicle.acceleration.y = vehicle.force.y / vehicle.mass;
  vehicle.velocity.x += vehicle.acceleration.x * ts;
  vehicle.velocity.y += vehicle.acceleration.y * ts;
  // Update position
  vehicle.x += vehicle.velocity.x * ts;
  vehicle.y += vehicle.velocity.y * ts;
}
