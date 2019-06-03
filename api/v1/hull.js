import { buildConvexHull, buildConvexSurfaceHull } from '@jsxcad/geometry-points';

import { Shape } from './Shape';

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
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * hull(circle(4),
 *      circle(2).translate(8));
 * ```
 * :::
 *
 **/

const Z = 2;

export const hull = (...shapes) => {
  const points = [];
  shapes.forEach(shape => shape.eachPoint({}, point => points.push(point)));
  if (points.every(point => point[Z] === 0)) {
    return Shape.fromPolygonsToZ0Surface([buildConvexSurfaceHull({}, points)]);
  } else {
    return Shape.fromPolygonsToSolid(buildConvexHull({}, points));
  }
};

const method = function (...shapes) { return hull(this, ...shapes); };

Shape.prototype.hull = method;
