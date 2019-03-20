import { fromPointAndDirection } from './fromPointAndDirection';
import { solve2Linear } from '@jsxcad/math-utils';
import { cross, fromValues, length as lengthOfVec3, scale } from '@jsxcad/math-vec3';

const EPS = 1e-5;

export const fromPlanes = (plane1, plane2) => {
  let direction = cross(plane1, plane2);
  let length = lengthOfVec3(direction);
  if (length < EPS) {
    throw new Error('parallel planes do not intersect');
  }
  length = (1.0 / length);
  direction = scale(length, direction);

  const absx = Math.abs(direction[0]);
  const absy = Math.abs(direction[1]);
  const absz = Math.abs(direction[2]);
  let origin;
  let r;
  if ((absx >= absy) && (absx >= absz)) {
    // find a point p for which x is zero
    r = solve2Linear(plane1[1], plane1[2], plane2[1], plane2[2], plane1[3], plane2[3]);
    origin = fromValues(0, r[0], r[1]);
  } else if ((absy >= absx) && (absy >= absz)) {
    // find a point p for which y is zero
    r = solve2Linear(plane1[0], plane1[2], plane2[0], plane2[2], plane1[3], plane2[3]);
    origin = fromValues(r[0], 0, r[1]);
  } else {
    // find a point p for which z is zero
    r = solve2Linear(plane1[0], plane1[1], plane2[0], plane2[1], plane1[3], plane2[3]);
    origin = fromValues(r[0], r[1], 0);
  }
  return fromPointAndDirection(origin, direction);
};
