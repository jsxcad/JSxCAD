import { max as maxOfVec3, min as minOfVec3 } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint';

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
export const measureBoundingBox = (surface) => {
  if (surface.measureBoundingBox === undefined) {
    let max = surface[0][0];
    let min = surface[0][0];
    eachPoint({},
              point => {
                max = maxOfVec3(max, point);
                min = minOfVec3(min, point);
              },
              surface);
    surface.measureBoundingBox = [min, max];
  }
  return surface.measureBoundingBox;
};
