const vec2 = require('@jsxcad/math-vec2');

/**
 * Construct a regular unit polygon of a given edge count.
 * Note: radius and length must not conflict.
 *
 * @param {Object} [options] - options for construction
 * @param {Integer} [options.edges=32] - how many edges the polygon has.
 * @returns {PointArray} Array of points along the path of the circle in CCW winding.
 *
 * @example
 * const circlePoints = regularPolygon({ edges: 32 })
 *
 * @example
 * const squarePoints = regularPolygon({ edges: 4 })
 * })
 */
const buildRegularPolygon = ({ edges = 32 }) => {
  let points = [];
  for (let i = 0; i < edges; i++) {
    let radians = 2 * Math.PI * i / edges;
    // let point = vec2.canonicalize(vec2.fromAngleRadians(radians))
    let point = vec2.fromAngleRadians(radians);
    points.push(point);
  }
  return points;
};

module.exports = buildRegularPolygon;
