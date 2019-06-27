import { fromAngleRadians } from '@jsxcad/math-vec2';

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
export const buildRegularPolygon = ({ edges = 32 } = {}) => {
  let points = [];
  for (let i = 0; i < edges; i++) {
    let radians = 2 * Math.PI * i / edges;
    let [x, y] = fromAngleRadians(radians);
    points.push([x, y, 0]);
  }
  points.isConvex = true;
  return points;
};
