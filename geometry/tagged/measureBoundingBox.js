import { max, min } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint';

export const measureBoundingBox = (geometry) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  let empty = true;
  eachPoint({},
            (point) => {
              minPoint = min(minPoint, point);
              maxPoint = max(maxPoint, point);
              empty = false;
            },
            geometry);
  if (empty) {
    return [[0, 0, 0], [0, 0, 0]];
  } else {
    return [minPoint, maxPoint];
  }
};
