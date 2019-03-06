const vec3 = require('@jsxcad/math-vec3');

//      0
//     /\
//  10/__\20
//   /\  /\
// 1/__\/__\2
//     21
const subdivideTriangle = (triangle) => {
  const t0 = triangle[0];
  const t1 = triangle[1];
  const t2 = triangle[2];
  const t10 = vec3.scale(1 / 2, vec3.add(t1, t0));
  const t20 = vec3.scale(1 / 2, vec3.add(t2, t0));
  const t21 = vec3.scale(1 / 2, vec3.add(t2, t1));
  // Turning CCW.
  return [[t0, t10, t20],
          [t10, t1, t21],
          [t20, t21, t2],
          [t10, t21, t20]];
};

module.exports = subdivideTriangle;
