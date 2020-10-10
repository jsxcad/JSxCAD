import { max as maxOfVec3, min as minOfVec3 } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint.js';

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
export const measureBoundingBox = (points) => {
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  eachPoint((point) => {
    max = maxOfVec3(max, point);
    min = minOfVec3(min, point);
  }, points);
  return [min, max];
};
