import {
  getAngle,
  getCorner1,
  getCorner2,
  getScale,
  getSides,
} from './Plan.js';

import Point from './Point.js';
import Shape from './Shape.js';
import Spiral from './Spiral.js';
import { taggedPlan } from '@jsxcad/geometry';

const X = 0;
const Y = 1;
const Z = 2;

const reifyArc =
  (axis = Z) =>
  (geometry) => {
    let { start = 0, end = 1 } = getAngle(geometry);

    while (start > end) {
      start -= 1;
    }

    const [scale, middle] = getScale(geometry);
    const corner1 = getCorner1(geometry);
    const corner2 = getCorner2(geometry);

    const left = corner1[X];
    const right = corner2[X];

    const front = corner1[Y];
    const back = corner2[Y];

    const bottom = corner1[Z];
    const top = corner2[Z];

    const step = 1 / getSides(geometry, 32);
    const steps = Math.ceil((end - start) / step);
    const effectiveStep = (end - start) / steps;

    let spiral;

    if (end - start === 1) {
      spiral = Spiral((t) => Point(1), {
        from: start - 1 / 4,
        upto: end - 1 / 4,
        by: effectiveStep,
      })
        .loop()
        .fill();
    } else {
      spiral = Spiral((t) => Point(1), {
        from: start - 1 / 4,
        to: end - 1 / 4,
        by: effectiveStep,
      });
      if (
        (axis === X && left !== right) ||
        (axis === Y && front !== back) ||
        (axis === Z && top !== bottom)
      ) {
        spiral = spiral.loop().fill();
      }
    }

    switch (axis) {
      case X: {
        scale[X] = 1;
        spiral = spiral
          .ry(-1 / 4)
          .scale(scale)
          .move(middle);
        if (left !== right) {
          spiral = spiral.ex(left - middle[X], right - middle[X]);
        }
        break;
      }
      case Y: {
        scale[Y] = 1;
        spiral = spiral
          .rx(-1 / 4)
          .scale(scale)
          .move(middle);
        if (front !== back) {
          spiral = spiral.ey(front - middle[Y], back - middle[Y]);
        }
        break;
      }
      case Z: {
        scale[Z] = 1;
        spiral = spiral.scale(scale).move(middle);
        if (top !== bottom) {
          spiral = spiral.ez(top - middle[Z], bottom - middle[Z]);
        }
        break;
      }
    }

    return spiral.absolute().tag(...geometry.tags);
  };

Shape.registerReifier('Arc', reifyArc(Z));
Shape.registerReifier('ArcX', reifyArc(X));
Shape.registerReifier('ArcY', reifyArc(Y));
Shape.registerReifier('ArcZ', reifyArc(Z));

const ArcOp = (type) => (x, y, z) => {
  switch (type) {
    case 'Arc':
    case 'ArcZ':
      if (x === undefined) {
        x = 1;
      }
      if (y === undefined) {
        y = x;
      }
      if (z === undefined) {
        z = 0;
      }
      break;
    case 'ArcX':
      if (y === undefined) {
        y = 1;
      }
      if (z === undefined) {
        z = y;
      }
      if (x === undefined) {
        x = 0;
      }
      break;
    case 'ArcY':
      if (x === undefined) {
        x = 1;
      }
      if (z === undefined) {
        z = x;
      }
      if (y === undefined) {
        y = 0;
      }
      break;
  }
  const c1 = [0, 0, 0];
  const c2 = [0, 0, 0];
  if (x instanceof Array) {
    if (x[0] < x[1]) {
      c1[X] = x[1];
      c2[X] = x[0];
    } else {
      c1[X] = x[0];
      c2[X] = x[1];
    }
  } else {
    c1[X] = x / 2;
    c2[X] = x / -2;
  }
  if (y instanceof Array) {
    if (y[0] < y[1]) {
      c1[Y] = y[1];
      c2[Y] = y[0];
    } else {
      c1[Y] = y[0];
      c2[Y] = y[1];
    }
  } else {
    c1[Y] = y / 2;
    c2[Y] = y / -2;
  }
  if (z instanceof Array) {
    if (z[0] < z[1]) {
      c1[Z] = z[1];
      c2[Z] = z[0];
    } else {
      c1[Z] = z[0];
      c2[Z] = z[1];
    }
  } else {
    c1[Z] = z / 2;
    c2[Z] = z / -2;
  }
  return Shape.fromGeometry(taggedPlan({}, { type }))
    .hasC1(...c1)
    .hasC2(...c2);
};

export const Arc = ArcOp('Arc');
export const ArcX = ArcOp('ArcX');
export const ArcY = ArcOp('ArcY');
export const ArcZ = ArcOp('ArcZ');

Shape.prototype.Arc = Shape.shapeMethod(Arc);
Shape.prototype.ArcX = Shape.shapeMethod(ArcX);
Shape.prototype.ArcY = Shape.shapeMethod(ArcY);
Shape.prototype.ArcZ = Shape.shapeMethod(ArcZ);

export default Arc;
