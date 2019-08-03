import { buildConvexHull, buildConvexMinkowskiSum } from '@jsxcad/geometry-points';

import { Shape } from './Shape';

/**
 *
 * # Minkowski (convex)
 *
 * Generates the minkowski sum of a two convex shapes.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * minkowski(Cube(10),
 *           Sphere(3));
 * ```
 * :::
 *
 **/

// TODO: Generalize for more operands?
export const minkowski = (a, b) => {
  const aPoints = [];
  const bPoints = [];
  a.eachPoint({}, point => aPoints.push(point));
  b.eachPoint({}, point => bPoints.push(point));
  return Shape.fromPolygonsToSolid(buildConvexHull({}, buildConvexMinkowskiSum({}, aPoints, bPoints)));
};
