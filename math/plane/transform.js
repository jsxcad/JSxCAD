import {
  add,
  cross,
  multiply,
  random,
  transform as transformVec3,
} from '@jsxcad/math-vec3';

import { flip } from './flip';
import { fromPoints } from './fromPoints';
import { isMirroring } from '@jsxcad/math-mat4';

/**
 * Transform the given plane using the given matrix
 * @return {Array} a new plane with properly typed values
 */
export const transform = (matrix, plane) => {
  const ismirror = isMirroring(matrix);
  // get two vectors in the plane:
  const r = random(plane);
  const u = cross(plane, r);
  const v = cross(plane, u);
  // get 3 points in the plane:
  let point1 = multiply(plane, [plane[3], plane[3], plane[3]]);
  let point2 = add(point1, u);
  let point3 = add(point1, v);
  // transform the points:
  point1 = transformVec3(matrix, point1);
  point2 = transformVec3(matrix, point2);
  point3 = transformVec3(matrix, point3);
  // and create a new plane from the transformed points:
  let newplane = fromPoints(point1, point2, point3);
  if (ismirror) {
    // the transform is mirroring so mirror the plane
    newplane = flip(newplane);
  }
  return newplane;
};
