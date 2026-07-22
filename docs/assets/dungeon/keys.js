/**
 * Keyboard and gyroscope input handler
 */

// arrow key codes
const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;

// movement directions
let moveUp = false;
let moveDown = false;
let moveRight = false;
let moveLeft = false;

// keyboard listeners
window.addEventListener(
  "keydown",
  (event) => {
    switch (event.keyCode) {
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
  },
  false
);

window.addEventListener(
  "keyup",
  (event) => {
    switch (event.keyCode) {
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
  },
  false
);

// gyroscope support for mobile devices
if (window.DeviceOrientationEvent) {
  window.addEventListener(
    "deviceorientation",
    (event) => {
      const beta = event.beta; // front or back tilt (forward is positive)
      const gamma = event.gamma; // left or right tilt (right is positive)

      // front and back tilt
      if (beta > 5) {
        moveDown = true;
        moveUp = false;
      } else if (beta < -5) {
        moveUp = true;
        moveDown = false;
      } else {
        moveUp = false;
        moveDown = false;
      }

      // left and right tilt
      if (gamma > 10) {
        moveRight = true;
        moveLeft = false;
      } else if (gamma < -10) {
        moveLeft = true;
        moveRight = false;
      } else {
        moveLeft = false;
        moveRight = false;
      }
    },
    false
  );
}
