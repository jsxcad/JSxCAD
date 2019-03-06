const fromValues = require('./fromValues');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;

const canonicalize = ([x = 0, y = 0, w = 0]) => fromValues(q(x), q(y), q(w));

module.exports = canonicalize;
