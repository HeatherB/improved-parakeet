/*
a javascript file for keyboard movement
*/


// arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

// directions
var moveUp = false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;

// add keyboard listeners
window.addEventListener("keydown", function(event) {
	switch(event.keyCode) {
		case UP:
			moveUp = true;
			break;

		case DOWN:
			moveDown = true;
			break;

		case LEFT:
			moveLeft = true;
			break;

		case RIGHT:
			moveRight = true;
			break;		
	}
}, false);

window.addEventListener("keyup", function(event) {
	switch(event.keyCode) {
		case UP:
			moveUp = false;
			break;

		case DOWN:
			moveDown = false;
			break;

		case LEFT:
			moveLeft = false;
			break;

		case RIGHT:
			moveRight = false;
			break;
	}
}, false);


// touch for gyroscope
if(window.DeviceOrientationEvent) { 
	window.addEventListener('deviceorientation', function(event) {
	  var alpha = event.alpha; // direction according to compass
	  var beta = event.beta; // front or back (forward is positive)
	  var gamma = event.gamma; // left or right  (right is positive)
	  // front and back tilt
	  if(beta > 5) {
	  	//$('.lost h1').css('color', 'red');
	  	moveDown = true;
	  	moveUp = false;
	  } else if(beta < -5) {
	  	//$('.lost h1').css('color', 'black');
	  	moveUp = true;
	  	moveDown = false;
	  } else {
	  	//$('.lost h1').css('color', 'green');
	  	moveUp = false;
	  	moveDown = false;
	  }
	  // left and right tilt
	  if(gamma > 10) {
	  	//$('.lost p').css('color', 'red');
	  	moveRight = true;
	  	moveLeft = false;
	  } else if(gamma < -10) {
	  	//$('.lost p').css('color', 'black');
	  	moveLeft = true;
	  	moveRight = false;
	  } else {
	  	moveLeft = false;
	  	moveRight = false;
	  	//$('.lost p').css('color', 'green');
	  }
	}, false);
}

/*window.ondevicemotion = function(event) {
	gamma = Math.round(event.gamma); // left to right
	beta = Math.rounnd(event.beta); // fron to back
	if(gamma == -27) {
		alert("gamma has reached -27");
	} else {
		alert("wtf");
	}
}*/