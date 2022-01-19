import { cross, normalize, squaredLength, subtract } from '@jsxcad/math-vec3';
import { Shape } from './Shape.js';
import { getInverseMatrices } from '@jsxcad/geometry';

const X = 0;
const Y = 1;
const Z = 2;

// These are all absolute positions in the world.
// at is where the object's origin should move to.
// to is where the object's axis should point at.
// up rotates around the axis to point a dorsal position toward.

export const orient =
  ({ at = [0, 0, 0], to = [0, 0, 0], up = [0, 0, 0] }) =>
  (shape) => {
    const { local } = getInverseMatrices(shape.toGeometry());
    // Algorithm from threejs Matrix4
    let u = subtract(up, at);
    if (squaredLength(u) === 0) {
      u[Z] = 1;
    }
    u = normalize(u);
    let z = subtract(to, at);
    if (squaredLength(z) === 0) {
      z[Z] = 1;
    }
    z = normalize(z);
    let x = cross(u, z);
    if (squaredLength(x) === 0) {
      // u and z are parallel
      if (Math.abs(u[Z]) === 1) {
        z[X] += 0.0001;
      } else {
        z[Z] += 0.0001;
      }
      z = normalize(z);
      x = cross(u, z);
    }
    x = normalize(x);
    let y = cross(z, x);
    const lookAt = [
      x[X],
      x[Y],
      x[Z],
      0,
      y[X],
      y[Y],
      y[Z],
      0,
      z[X],
      z[Y],
      z[Z],
      0,
      0,
      0,
      0,
      1,
    ];
    // FIX: Move this to CGAL.
    lookAt.blessed = true;
    return shape
      .transform(local)
      .transform(lookAt)
      .move(...at);
  };

Shape.registerMethod('orient', orient);

export default orient;
