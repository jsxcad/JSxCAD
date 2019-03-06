const path = require('@jsxcad/algorithm-path');

const flip = (paths) => paths.map(path.flip);

module.exports = flip;
