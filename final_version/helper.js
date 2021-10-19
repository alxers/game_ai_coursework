function drawVehicle2(ts) {
  ctx.fillStyle = '#ff8080';
  ctx.fillRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
}

function drawVehicle(ts) {
  // Drawn with x and y in the center of a vehicle
  ctx.save();
  ctx.translate(vehicle.x, vehicle.y);
  ctx.rotate(vehicle.rotation);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-10, 10);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-10, -10);
  ctx.lineTo(10, 0);
  ctx.stroke();
  if (vehicle.showFlame) {
    ctx.beginPath();
    ctx.moveTo(-7.5, -5);
    ctx.lineTo(-15, 0);
    ctx.lineTo(-7.5, 5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDetectionBox() {
  var clr = 'rgba(61, 48, 48, 0.1)';

  if (DEBUG_MODE) {
    drawCircle(vehicle, '#abc');
    clr = 'rgba(61, 48, 48, 0.5)';
  }
  ctx.save();
  ctx.translate(vehicle.x, vehicle.y);
  ctx.rotate(vehicle.rotation);
  ctx.fillStyle = clr;
  ctx.fillRect(-10, -10, DETECTION_BOX_LEN, 2*vehicle.radius);
  ctx.restore();
}

function drawCircle(circle, clr) {
  var color = '#880000';
  if (circle.type == GOOD) {
    color = '#0095DD';
  }

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
  ctx.fillStyle = color;
  if (DEBUG_MODE) {
    ctx.fillStyle = clr;
  }
  ctx.fill();
  ctx.closePath();
}

function drawCircles(ts) {
  if (randFromTo(0, 1000) > 987 && existingCircles.length < maxCircles && !DEBUG_MODE) {
    if (AT_LEAST_ONE_GOOD) {
      var r = randFromTo(8, 18);
      existingCircles.push(createCircle(null, r));
    } else {
      existingCircles.push(createCircle(GOOD));
    }
  }
  AT_LEAST_ONE_GOOD = false;

  var circleIndexesToRemove = [];

  for (var i = 0; i < existingCircles.length; i++) {
    var currCircle = existingCircles[i];
    if (currCircle.type === GOOD) {
      AT_LEAST_ONE_GOOD = true;
    }
    currCircle.tStart ||= ts;
    if (ts - currCircle.tStart <= currCircle.lifetime) {
      drawCircle(currCircle);
    } else {
      circleIndexesToRemove.push(i);
    }
  }

  for (var j = 0; j < circleIndexesToRemove.length; j++) {
    existingCircles.splice(j, 1);
  }

}

function drawPoint(x, y) {
  ctx.fillRect(x, y, 3, 3);
}

function findClosestCircle() {
  if (!existingCircles.length) {
    return { x: null, y: null };
  }

  var result;
  var currMin = Number.MAX_VALUE;
  var ind;
  for (var i = 0; i < existingCircles.length; i++) {
    if (existingCircles[i].type === GOOD) {
      var currDist = distanceSquared(vehicle.x, vehicle.y, existingCircles[i].x, existingCircles[i].y)
      if (currDist < currMin) {
        currMin = currDist;
        ind = i;
        result = existingCircles[ind];
      }
    }
  }

  if (!result) {
    result = { x: null, y: null };
  }

  return result;
}

function createCircle(t, radius, xc, yc) {
  var lifetime = 20 + randFromTo(10, 50);
  var type = BAD;

  if (randFromTo(0, 100) > 70) {
    type = GOOD;
  }

  if (t) {
    type = t;
  }

  if (!radius) {
    radius = randFromTo(8, 18);
  }

  var x = xc || randFromTo(radius, canvas.width - radius);
  var y = yc || randFromTo(radius, canvas.height - radius);
  return {
    lifetime: lifetime,
    type: type,
    // if Current time - tStart > lifetime, then do not draw anymore
    tStart: null,
    // x and y coords
    x: x,
    y: y,
    // Used in obstacle avoidance
    radius: radius,
    isTagged: false
  }
}

function randFromTo(from, to) {
  var range = to - from;
  return Math.ceil(Math.random() * range) + from;
}

function collisionDetection() {
  for (var i = 0; i < existingCircles.length; i++) {
    var currCircle = existingCircles[i];
    if (circleToCircleColliding(vehicle, currCircle)) {
      if (existingCircles[i].type === GOOD) {
        vehicle.collidedWithGood += 1;
      }
      if (existingCircles[i].type === BAD) {
      console.log("Collided");
        vehicle.collidedWithBad += 1;
      }
      existingCircles.splice(i, 1);
    }
  }
}

function circleToCircleColliding(c1, c2) {
  var diffX = Math.abs(c2.x - c1.x);
  var diffY = Math.abs(c2.y - c1.y);
  var dist = Math.sqrt(diffX * diffX + diffY * diffY);
  var delta = -0.8;
  var radiusSum = c1.radius + c2.radius + delta;
  return (dist <= radiusSum);
}

document.addEventListener('click', function(e) {
  if (!e.target) {
    return;
  }

  // If clicked on canvas
  if (e.target.id === 'ai') {
    console.log(`x: ${e.x}, y: ${e.y}`);
    existingCircles.push(createCircle(BAD, 10, e.x, e.y));
  }

  if (e.target.className === 'debug-btn') {
    DEBUG_MODE = false;
    e.target.innerText = "Random mode";
    e.target.disabled = true;
  }
});
