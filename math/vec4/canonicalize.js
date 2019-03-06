const fromValues = require('./fromValues');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;

const canonicalize = vector => fromValues(...vector.map(q));

module.exports = canonicalize;
