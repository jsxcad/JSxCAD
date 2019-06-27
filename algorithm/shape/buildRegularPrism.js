import { buildRegularPolygon } from './buildRegularPolygon';
import { extrudeLinear } from './extrudeLinear';
import { translate } from '@jsxcad/geometry-solid';

/**
 * Construct a regular unit prism of a given edge count.
 * Note: radius and length must not conflict.
 *
 * @param {Object} [options] - options for construction
 * @param {Integer} [options.edges=32] - how many edges the polygon has.
 * @returns {PointArray} Array of points along the path of the circle in CCW winding.
 *
 * @example
 * const circlePoints = regularPolygon({ edges: 32 })
 */

export const buildRegularPrism = ({ edges = 32 }) => {
  const surface = [buildRegularPolygon({ edges: edges })];
  surface.isConvex = true;
  return extrudeLinear({ height: 1 }, surface);
};
