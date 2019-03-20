import { fromValues } from '@jsxcad/math-mat4';
import { cross, fromScalar, multiply, random, unit } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

export const toXYPlaneTransforms = (plane, rightVector) => {
  if (rightVector === undefined) {
    rightVector = random(plane);
  }

  const v = unit(cross(plane, rightVector));
  const u = cross(v, plane);
  const p = multiply(plane, fromScalar(plane[W]));

  return {
    toXYPlane: fromValues(
      u[X], v[X], plane[X], 0,
      u[Y], v[Y], plane[Y], 0,
      u[Z], v[Z], plane[Z], 0,
      0, 0, -plane[W], 1),
    fromXYPlane: fromValues(
      u[X], u[Y], u[Z], 0,
      v[X], v[Y], v[Z], 0,
      plane[X], plane[Y], plane[Z], 0,
      p[X], p[Y], p[Z], 1)
  };
};
