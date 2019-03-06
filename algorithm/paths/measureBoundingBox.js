const eachPoint = require('./eachPoint');
const vec3 = require('@jsxcad/math-vec3');

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (paths) => {
  let max;
  let min;
  eachPoint({},
            point => {
              max = (max === undefined) ? vec3.fromPoint(point) : vec3.max(max, vec3.fromPoint(point));
              min = (min === undefined) ? vec3.fromPoint(point) : vec3.min(min, vec3.fromPoint(point));
            },
            paths);
  return [min, max];
};

module.exports = measureBoundingBox;
