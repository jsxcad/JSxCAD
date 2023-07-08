import { Link, Loop } from './link.js';
import { buildCorners, computeMiddle, computeScale } from './corners.js';
import { extrudeAlongX, extrudeAlongY, extrudeAlongZ } from './extrude.js';
import { rotateX, rotateY, rotateZ } from './rotate.js';

import { Point } from './Point.js';
import { computeSides } from './sides.js';
import { fill } from './fill.js';
import { makeAbsolute } from './makeAbsolute.js';
import { scale as scaleOp } from './scale.js';
import { seq } from './seq.js';
import { translate } from './translate.js';

const toDiameterFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

const X = 0;
const Y = 1;
const Z = 2;

const makeArc =
  (axis = Z) =>
  ({ c1, c2, start = 0, end = 1, zag, sides }) => {
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

    let spiral = Link(
      seq({
        from: start - 1 / 4,
        to: end - 1 / 4,
        by: effectiveStep,
      }).map((t) => rotateZ(Point(0.5), t))
    );

    if (
      end - start === 1 ||
      (axis === X && left !== right) ||
      (axis === Y && front !== back) ||
      (axis === Z && top !== bottom)
    ) {
      spiral = fill(Loop([spiral]));
    }

    switch (axis) {
      case X: {
        scale[X] = 1;
        spiral = translate(scaleOp(rotateY(spiral, -1 / 4), scale), middle);
        if (left !== right) {
          spiral = extrudeAlongX(spiral, [
            [left - middle[X], right - middle[X]],
          ]);
        }
        break;
      }
      case Y: {
        scale[Y] = 1;
        spiral = translate(scaleOp(rotateX(spiral, -1 / 4), scale), middle);
        if (front !== back) {
          spiral = extrudeAlongY(spiral, [
            [front - middle[Y], back - middle[Y]],
          ]);
        }
        break;
      }
      case Z: {
        scale[Z] = 1;
        spiral = translate(scaleOp(spiral, scale), middle);
        if (top !== bottom) {
          spiral = extrudeAlongZ(spiral, [
            [top - middle[Z], bottom - middle[Z]],
          ]);
        }
        break;
      }
      default: {
        throw Error(`Unhandled Arc axis: ${axis}`);
      }
    }

    return makeAbsolute(spiral);
  };

const makeArcX = makeArc(X);
const makeArcY = makeArc(Y);
const makeArcZ = makeArc(Z);

const ArcOp =
  (type) =>
  ([x, y, z], { apothem, diameter, radius, start, end, sides, zag } = {}) => {
    if (apothem !== undefined) {
      diameter = toDiameterFromApothem(apothem, sides);
    }
    if (radius !== undefined) {
      diameter = radius * 2;
    }
    if (diameter !== undefined) {
      x = diameter;
    }
    let make;
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
        make = makeArcZ;
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
        make = makeArcX;
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
        make = makeArcY;
        break;
    }
    const [c1, c2] = buildCorners(x, y, z);
    const result = make({ c1, c2, start, end, sides, zag });
    return result;
  };

export const Arc = ArcOp('Arc');
export const ArcX = ArcOp('ArcX');
export const ArcY = ArcOp('ArcY');
export const ArcZ = ArcOp('ArcZ');

export default Arc;

export const Hexagon = ([x, y, z]) => Arc([x, y, z], { sides: 6 });
export const Octagon = ([x, y, z]) => Arc([x, y, z], { sides: 8 });
