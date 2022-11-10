import Point from './Point.js';
import Shape from './Shape.js';
import Spiral from './Spiral.js';
import {
  buildCorners,
  // getAngle,
  // getCorner1,
  // getCorner2,
  // getScale,
  // getSides,
} from './Plan.js';
import { destructure } from './destructure.js';

// import { taggedPlan } from '@jsxcad/geometry';
import { zag as toSidesFromZag } from '@jsxcad/api-v1-math';

const X = 0;
const Y = 1;
const Z = 2;

const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];
const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];
const subtract = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [ax - bx, ay - by, az - bz];
const computeScale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const computeSides = (c1, c2, sides, zag = 0.01) => {
  if (sides) {
    return sides;
  }
  if (zag) {
    const diameter = Math.max(...abs(subtract(c1, c2)));
    return toSidesFromZag(diameter, zag);
  }
  return 32;
};

const reifyArc =
  (axis = Z) =>
  ({ c1, c2, start = 0, end = 1, zag, sides }) => {
    while (start > end) {
      start -= 1;
    }

    const scale = subtract(c1, c2);
    const middle = computeScale(0.5, add(c1, c2));

    const left = c1[X];
    const right = c2[X];

    const front = c1[Y];
    const back = c2[Y];

    const bottom = c1[Z];
    const top = c2[Z];

    const step = 1 / computeSides(c1, c2, sides, zag);
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

    return spiral.absolute();
  };

const reifyArcZ = reifyArc(Z);
const reifyArcX = reifyArc(X);
const reifyArcY = reifyArc(Y);

const ArcOp = (type) => (...args) => {
  const { values, object: options } = destructure(args);
  let [x, y, z] = values;
  const { start, end, sides, zag } = options;
  let reify;
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
      reify = reifyArcZ;
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
      reify = reifyArcX;
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
      reify = reifyArcY;
      break;
  }
  const [c1, c2] = buildCorners(x, y, z);
  return reify({ c1, c2, start, end, sides, zag });
};

export const Arc = Shape.registerShapeMethod('Arc', ArcOp('Arc'));
export const ArcX = Shape.registerShapeMethod('ArcX', ArcOp('ArcX'));
export const ArcY = Shape.registerShapeMethod('ArcY', ArcOp('ArcY'));
export const ArcZ = Shape.registerShapeMethod('ArcZ', ArcOp('ArcZ'));

export default Arc;
