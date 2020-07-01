import { fromPoint, max, min } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint.js';

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
export const measureBoundingBox = (paths) => {
  let minPoint;
  let maxPoint;
  eachPoint((point) => {
    minPoint =
      minPoint === undefined
        ? fromPoint(point)
        : min(minPoint, fromPoint(point));
    maxPoint =
      maxPoint === undefined
        ? fromPoint(point)
        : max(maxPoint, fromPoint(point));
  }, paths);
  return [minPoint, maxPoint];
};
