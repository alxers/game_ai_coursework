// Declare as variable
let canvas;
let ctx;
let secondsPassed;
let oldTimeStamp;
let fps;

// Circles variables
var circleRadius = 10;
var maxCircles = 12;
var existingCircles = [];
// end Circles variables

// Listen to the onLoad event
window.onload = init;

// Trigger init function when the page has loaded
function init() {
  canvas = document.getElementById('ai');
  ctx = canvas.getContext('2d');

  // Request an animation frame for the first time
  // The gameLoop() function will be called as a callback of this request
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {

  // Calculate the number of seconds passed since the last frame
  // secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  // oldTimeStamp = timeStamp;
  // tNow = timeStamp;

  // // Calculate fps
  // fps = Math.round(1 / secondsPassed);

  // Perform the drawing operation
  draw(timeStamp);

  // The loop function has reached it's end
  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function draw(timeStamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect();
  drawCircles(timeStamp / 1000);
}


// Helper

function drawRect() {
  // Get a random color, red or blue
  ctx.fillStyle = '#ff8080';
  // ctx.fillStyle = Math.random() > 0.5 ? '#ff8080' : '#0099b0';

  // Draw a rectangle on the canvas
  ctx.fillRect(100, 50, 200, 175);
}

function drawCircle(x, y, type) {
  var color = '#880000';
  if (type == 2) {
    color = '#0095DD';
  }
  // var x = canvas.width/2;
  // var y = canvas.height-30;
  ctx.beginPath();
  ctx.arc(x, y, circleRadius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawCircles(timeStamp) {
  if (randFromTo(0, 1000) > 993 && existingCircles.length < maxCircles) {
    existingCircles.push(createCircle());
  }

  if (existingCircles.length) {
    // debugger;
  }

  var circleIndexesToRemove = [];

  for (var i = 0; i < existingCircles.length; i++) {
    var currCircle = existingCircles[i];
    currCircle.tStart ||= timeStamp;
    if (timeStamp - currCircle.tStart <= currCircle.lifetime) {
      drawCircle(currCircle.x, currCircle.y, currCircle.type);
    } else {
      // existingCircles.splice(i, 1);
      circleIndexesToRemove.push(i);
    }
  }

  for (var j = 0; j < circleIndexesToRemove.length; j++) {
    existingCircles.splice(j, 1);
  }

}

function createCircle() {
  var lifetime = randFromTo(10, 30);
  // Type 1: mine
  var type = 1;

  if (randFromTo(0, 100) > 80) {
    // Type 2: energy
    type = 2;
  }

  var x = randFromTo(circleRadius, canvas.width - circleRadius);
  var y = randFromTo(circleRadius, canvas.height - circleRadius);
  console.log(lifetime);
  return {
    lifetime: lifetime,
    // Type 1 - energy, type 2 - mine
    type: type,
    // if Current time - tStart > lifetime, then do not draw anymore
    tStart: null,
    // x and y coords
    x: x,
    y: y
  }
}

function randFromTo(from, to) {
  var range = to - from;
  return Math.ceil(Math.random() * range) + from;
}

function drawNumber() {
    // Draw number to the screen
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 100);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    // ctx.fillText("sec: " + oldTimeStamp, 10, 30);
}
// end Helper

