const transformPath = require('@jsxcad/algorithm-path').transform;

const transform = (matrix, paths) => paths.map(path => transformPath(matrix, path));

module.exports = transform;
