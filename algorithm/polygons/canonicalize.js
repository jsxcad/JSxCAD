const poly3 = require('@jsxcad/math-poly3');

const canonicalize = polygons => polygons.map(poly3.canonicalize);

module.exports = canonicalize;
