const fromValues = require('./fromValues');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;

const canonicalize = ([x, y]) => fromValues(q(x), q(y));

module.exports = canonicalize;
