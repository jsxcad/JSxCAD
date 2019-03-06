const vec3 = require('@jsxcad/math-vec3');

const subtract = (subtrahend, polygons) => {
  const sub = vec3.fromPoint(subtrahend);
  return polygons.map(polygon => polygon.map(point => vec3.subtract(vec3.fromPoint(point), sub)));
};

module.exports = subtract;
