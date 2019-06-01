import { max as maxOfVec3, min as minOfVec3 } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint';

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
export const measureBoundingBox = (solid) => {
  if (solid.measureBoundingBox === undefined) {
    let max = solid[0][0][0];
    let min = solid[0][0][0];
    eachPoint({},
              point => {
                max = maxOfVec3(max, point);
                min = minOfVec3(min, point);
              },
              solid);
    solid.measureBoundingBox = [min, max];
  }
  return solid.measureBoundingBox;
};
