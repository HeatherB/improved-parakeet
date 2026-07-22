/**
 * Collision detection functions
 * - hitTestPoint
 * - hitTestCircle
 * - blockCircle
 * - hitTestRectangle
 * - blockRectangle
 */

// hitTestPoint - check if a point is inside a sprite
function hitTestPoint(pointX, pointY, sprite) {
  return (
    pointX > sprite.left() &&
    pointX < sprite.right() &&
    pointY > sprite.top() &&
    pointY < sprite.bottom()
  );
}

// hitTestCircle - check if two circles are colliding
function hitTestCircle(c1, c2) {
  const vx = c1.centerX() - c2.centerX();
  const vy = c1.centerY() - c2.centerY();
  const magnitude = Math.sqrt(vx * vx + vy * vy);
  const totalRadii = c1.halfWidth() + c2.halfWidth();

  return magnitude < totalRadii;
}

// blockCircle - separate two colliding circles
function blockCircle(c1, c2) {
  const vx = c1.centerX() - c2.centerX();
  const vy = c1.centerY() - c2.centerY();
  const magnitude = Math.sqrt(vx * vx + vy * vy);
  const combinedHalfWidths = c1.halfWidth() + c2.halfWidth();

  if (magnitude < combinedHalfWidths) {
    const overlap = combinedHalfWidths - magnitude;
    const dx = vx / magnitude;
    const dy = vy / magnitude;

    c1.x += overlap * dx;
    c1.y += overlap * dy;
  }
}

// hitTestRectangle - check if two rectangles are colliding
function hitTestRectangle(r1, r2) {
  const vx = r1.centerX() - r2.centerX();
  const vy = r1.centerY() - r2.centerY();
  const combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  const combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      return true;
    }
  }

  return false;
}

// blockRectangle - separate two colliding rectangles and return collision side
function blockRectangle(r1, r2) {
  let collisionSide = "";

  const vx = r1.centerX() - r2.centerX();
  const vy = r1.centerY() - r2.centerY();
  const combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  const combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      const overlapX = combinedHalfWidths - Math.abs(vx);
      const overlapY = combinedHalfHeights - Math.abs(vy);

      if (overlapX >= overlapY) {
        if (vy > 0) {
          collisionSide = "top";
          r1.y = r1.y + overlapY;
        } else {
          collisionSide = "bottom";
          r1.y = r1.y - overlapY;
        }
      } else {
        if (vx > 0) {
          collisionSide = "left";
          r1.x = r1.x + overlapX;
        } else {
          collisionSide = "right";
          r1.x = r1.x - overlapX;
        }
      }
    } else {
      collisionSide = "none";
    }
  } else {
    collisionSide = "none";
  }

  return collisionSide;
}
