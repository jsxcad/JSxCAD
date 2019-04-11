import { eachPoint } from './eachPoint';
import { max as maxOfVec3, min as minOfVec3 } from '@jsxcad/math-vec3';

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
export const measureBoundingBox = (solid) => {
  let max = solid[0][0][0];
  let min = solid[0][0][0];
  eachPoint({},
            point => {
              max = maxOfVec3(max, point);
              min = minOfVec3(min, point);
            },
            solid);
  return [min, max];
};
