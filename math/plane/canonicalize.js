const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;

const canonicalize = ([x, y, z, w]) => [q(x), q(y), q(z), q(w)];

module.exports = canonicalize;
