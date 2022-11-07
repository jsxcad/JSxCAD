import {
  buildCorners,
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
  (plan) => {
    let { start = 0, end = 1 } = getAngle(plan.toGeometry());

    while (start > end) {
      start -= 1;
    }

    const [scale, middle] = getScale(plan.toGeometry());
    const corner1 = getCorner1(plan.toGeometry());
    const corner2 = getCorner2(plan.toGeometry());

    const left = corner1[X];
    const right = corner2[X];

    const front = corner1[Y];
    const back = corner2[Y];

    const bottom = corner1[Z];
    const top = corner2[Z];

    const step = 1 / getSides(plan.toGeometry(), 32);
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

    return spiral.absolute().tag(...plan.toGeometry().tags);
  };

// Shape.registerReifier('Arc', reifyArc(Z));
// Shape.registerReifier('ArcX', reifyArc(X));
// Shape.registerReifier('ArcY', reifyArc(Y));
// Shape.registerReifier('ArcZ', reifyArc(Z));

const reifyArcZ = reifyArc(Z);
const reifyArcX = reifyArc(X);
const reifyArcY = reifyArc(Y);

const ArcOp = (type) => (x, y, z) => {
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
  return reify(Shape.fromGeometry(taggedPlan({}, { type }))
    .hasC1(...c1)
    .hasC2(...c2));
};

export const Arc = Shape.registerShapeMethod('Arc', ArcOp('Arc'));
export const ArcX = Shape.registerShapeMethod('ArcX', ArcOp('ArcX'));
export const ArcY = Shape.registerShapeMethod('ArcY', ArcOp('ArcY'));
export const ArcZ = Shape.registerShapeMethod('ArcZ', ArcOp('ArcZ'));

export default Arc;
