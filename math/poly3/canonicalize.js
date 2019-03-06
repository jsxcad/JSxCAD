const map = require('./map');
const vec3 = require('@jsxcad/math-vec3');

const canonicalize = polygon => map(polygon, vec3.canonicalize);

module.exports = canonicalize;
