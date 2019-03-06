const eachPoint = require('./eachPoint');
const vec3 = require('@jsxcad/math-vec3');

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (polygons) => {
  let max = polygons[0][0];
  let min = polygons[0][0];
  eachPoint({},
            point => {
              max = vec3.max(max, point);
              min = vec3.min(min, point);
            },
            polygons);
  return [min, max];
};

module.exports = measureBoundingBox;
