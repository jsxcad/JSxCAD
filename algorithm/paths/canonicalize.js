const path = require('@jsxcad/algorithm-path');

const canonicalize = (paths) => paths.map(path.canonicalize);

module.exports = canonicalize;
