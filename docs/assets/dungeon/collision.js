/* 
this javascript file contains five collision functions
- hitTestPoint
- hitTEstCircle
- blockCircle
- hitTestRectangle
- blockRectangle

to use them, setup a sprite object with these minimum properties:

var spriteObject = {
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 64,
	sourceHeight: 64,
	width: 64,
	height: 64,
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,

	// getters
	centerX: function() {
		return this.x + (this.width / 2);
	},
	centerY: function() {
	return this.y + (this.height / 2);
	},
	halfWidth: function() {
		return this.width / 2;
	},
	halfHeight: function() {
		return this.height / 2;
	},
	left: function() {
		return this.x 
	},
	right: function() {
		return this.x + this.width;
	},
	top: function() {
		return this.y;
	},
	bottom: function() {
		return this.y + this.height;
	}
};

*/

// hitTestPoint
function hitTestPoint(pointX, pointY, sprite) {
	var hit = pointX > sprite.left() && pointX < sprite.right() && pointY > sprite.top() && pointY < sprite.bottom();

	return hit;
}

// hitTestCircle
function hitTestCircle(c1, c2) {
	// calculate the vector between the circles center points
	var vx = c1.centerX() - c2.centerX();
	var vy = c1.centerY() - c2.centerY();

	// find the distance between the circles by calculating
	// the vectors magnitude (how long the vector is)
	var magnitude = Math.sqrt(vx * vx + vy * vy);

	// add together the circles total radii
	var totalRadii = c1.halfWidth() + c2.halfWidth();

	// set hit to true if the distance between the circles is
	// less than their totalRadii
	var hit = magnitude < totalRadii;

	return hit;
} 

// blockCircle
function blockCircle(r1, r2) {
	// calculate the vector between the circles center points
	var vx = c1.centerX() - c2.centerX();
	var vy = c1.centerY() - c2.centerY();

	// find the distance between the circles by calculating
	// the vectors magnitude (how long the vector is)
	var magnitude = Math.sqrt(vx * vx + vy * vy);

	// add together the circles combined half widths
	var combinedHalfWidths = c1.halfWidth() + c2.halfWidth();

	// figure out if theres a collision
	if (magnitude < combinedHalfWidths) {
		// yes, a collision is happening
		// find the amount of overlap between the circles
		var overlap = combinedHalfWidths - magnitude;

		// normalize the vector
		// these numbers tell us the direction of the collision
		dx = vx / magnitude;
		dy = vy / magnitude;

		// move circle 1 out of the collision by multiplying
		// the overlap with the normalized vector and add it to
		// circle 1's position
		c1.x += overlap * dx;
		c1.y += overlap * dy;
	}
}

// hitTestRectangle
function hitTestRectangle(r1, r2) {
	// a variable to determine whether theres a collision
	var hit = false;

	// caluculate the distance vector
	var vx = r1.centerX() - r2.centerX();
	var vy = r1.centerY() - r2. centerY();

	// figure out the combined half widths and half heights
	var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
	var combinedHalfHeigths = r1.halfHeight() + r2.halfHeight();

	// check for a collision on the x axis
	if (Math.abs(vx) < combinedHalfWidths) {
		// a collision might be occuring, check for a collision on the y axis
		if (Math.abs(vy) < combinedHalfHeigths) {
			// theres definitely a collision happening
			hit = true;
		} else {
			// there s no collision on the y axis
			hit = false;
		}
	} else {
		// theres no collision on the x axis
		hit = false;
	}

	 return hit;
}

// blockRectangle
function blockRectangle(r1, r2) {
	// a variable to tell us which side the
	// collision is occurring on
	var collisionSide = "";

	// calculate the distance vector
	var vx = r1.centerX() - r2.centerX();
	var vy = r1.centerY() - r2.centerY();

	// figure out the combined half-wdiths and half-heights
	var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
	var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

	// check whether vx is less than the combined half widths
	if (Math.abs(vx) < combinedHalfWidths) {
		// a collision might be occuring
		// check whether vy is less than the combined half heights
		if (Math.abs(vy) < combinedHalfHeights) {
			// a collision has occured
			// find out the size of the overlap on both the x and y axis
			var overlapX = combinedHalfWidths - Math.abs(vx);
			var overlapY = combinedHalfHeights - Math.abs(vy);

			// the collision has occured on teh axis with the
			// smallest amount of overlap.
			// lets find out which axis that is
			if (overlapX >= overlapY) {
				// the collision is happening on the x axis
				// but on which side, vy can tell us
				if (vy > 0) {
					collisionSide = "top";

					// move the rectangle out of the collision
					r1.y = r1.y + overlapY;
				} else {
					collisionSide = "bottom";

					// move the rectangle out of the collision
					r1.y = r1.y - overlapY;
				}
			} else {
				// the collision is happening on the Y axis
				// but on which side? vx can tell us
				if (vx > 0) {
					collisionSide = "left";

					// move the rectangl out of the collision
					r1.x = r1.x + overlapX;
				} else {
					collisionSide = "right";

					// move the rectangle out of the collision
					r1.x = r1.x - overlapX;
				}
			}
		} else {
			// no collision
			collisionSide = "none";
		}
	} else {
		// no collision
		collisionSide = "none";
	}

	return collisionSide;
}