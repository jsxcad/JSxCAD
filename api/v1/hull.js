import { Shape } from './Shape';
import { buildConvexHull } from '@jsxcad/geometry-points';

/**
 *
 * # Hull
 *
 * Builds the convex hull of a set of shapes.
 *
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * hull(point([0, 0, 10]),
 *      circle(10))
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * assemble(point([0, 0, 10]),
 *          circle(10))
 *   .hull()
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * point([0, 0, 10]).hull(circle(10))
 * ```
 * :::
 *
 **/

export const hull = (...geometries) => {
  // FIX: Support z0Surface hulling.
  const points = [];
  geometries.forEach(geometry => geometry.eachPoint({}, point => points.push(point)));
  return Shape.fromPolygonsToSolid(buildConvexHull({}, points));
};

const method = function (...shapes) { return hull(this, ...shapes); };

Shape.prototype.hull = method;
