const mat4 = require('@jsxcad/math-mat4');

/**
 * Produces an empty, open path.
 * @returns {path2} - the empty, open path.
 * @example
 * create()
 */
const create = () => {
  return {
    __jsxcadTag__: '@jsxcad/geometry-path',
    basePoints: [], // Contains canonical, untransformed points.
    points: [], // Contains canonical, transformed points.
    isClosed: false,
    isCanonicalized: false,
    transforms: mat4.identity()
  };
};

module.exports = create;
