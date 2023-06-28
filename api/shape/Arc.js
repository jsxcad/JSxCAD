/*
import {
  buildCorners,
  computeMiddle,
  computeScale,
  computeSides,
} from './Plan.js';

import Point from './Point.js';
import Shape from './Shape.js';
import Spiral from './Spiral.js';
import { absolute } from './absolute.js';

const toDiameterFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

const X = 0;
const Y = 1;
const Z = 2;

const reifyArc =
  (axis = Z) =>
  async ({ c1, c2, start = 0, end = 1, zag, sides }) => {
    while (start > end) {
      start -= 1;
    }

    const scale = computeScale(c1, c2);
    const middle = computeMiddle(c1, c2);

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
      spiral = Spiral((_t) => Point(0.5), {
        from: start - 1 / 4,
        upto: end - 1 / 4,
        by: effectiveStep,
      })
        .loop()
        .fill();
    } else {
      spiral = Spiral((_t) => Point(0.5), {
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
          spiral = spiral.ex([left - middle[X], right - middle[X]]);
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
          spiral = spiral.ey([front - middle[Y], back - middle[Y]]);
        }
        break;
      }
      case Z: {
        scale[Z] = 1;
        spiral = spiral.scale(scale).move(middle);
        if (top !== bottom) {
          spiral = spiral.ez([top - middle[Z], bottom - middle[Z]]);
        }
        break;
      }
    }

    return absolute()(spiral);
  };

const reifyArcZ = reifyArc(Z);
const reifyArcX = reifyArc(X);
const reifyArcY = reifyArc(Y);

const ArcOp =
  (type) =>
  async (
    [x, y, z],
    { apothem, diameter, radius, start, end, sides, zag } = {}
  ) => {
    if (apothem !== undefined) {
      diameter = toDiameterFromApothem(apothem, sides);
    }
    if (radius !== undefined) {
      diameter = radius * 2;
    }
    if (diameter !== undefined) {
      x = diameter;
    }
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
    const [c1, c2] = await buildCorners(x, y, z)(null);
    const result = await reify({ c1, c2, start, end, sides, zag });
    const geometry = await result.toGeometry();
    return geometry;
  };
*/

import {
  Arc as ArcOp,
  ArcX as ArcXOp,
  ArcY as ArcYOp,
  ArcZ as ArcZOp,
} from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Arc = Shape.registerMethod3(
  'Arc',
  ['intervals', 'options'],
  ArcOp
);
export const ArcX = Shape.registerMethod3(
  'ArcX',
  ['intervals', 'options'],
  ArcXOp
);
export const ArcY = Shape.registerMethod3(
  'ArcY',
  ['intervals', 'options'],
  ArcYOp
);
export const ArcZ = Shape.registerMethod3(
  'ArcZ',
  ['intervals', 'options'],
  ArcZOp
);

export default Arc;
