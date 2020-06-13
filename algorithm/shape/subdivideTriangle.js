import { add, scale } from '@jsxcad/math-vec3';

//      0
//     /\
//  10/__\20
//   /\  /\
// 1/__\/__\2
//     21
export const subdivideTriangle = (triangle) => {
  const t0 = triangle[0];
  const t1 = triangle[1];
  const t2 = triangle[2];
  const t10 = scale(1 / 2, add(t1, t0));
  const t20 = scale(1 / 2, add(t2, t0));
  const t21 = scale(1 / 2, add(t2, t1));
  // Turning CCW.
  return [
    [t0, t10, t20],
    [t10, t1, t21],
    [t20, t21, t2],
    [t10, t21, t20],
  ];
};
