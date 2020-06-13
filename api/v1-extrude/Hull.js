import {
  buildConvexHull,
  buildConvexSurfaceHull,
} from '@jsxcad/algorithm-shape';

import { Shape } from '@jsxcad/api-v1-shape';

/**
 *
 * # Hull
 *
 * Builds the convex hull of a set of shapes.
 *
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * hull(Point([0, 0, 10]),
 *      Circle(10))
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * assemble(Point([0, 0, 10]),
 *          Circle(10))
 *   .hull()
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * Point([0, 0, 10]).hull(Circle(10))
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * hull(Circle(4),
 *      Circle(2).move(8));
 * ```
 * :::
 *
 **/

const Z = 2;

export const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  // FIX: Detect planar hulls properly.
  if (points.every((point) => point[Z] === 0)) {
    return Shape.fromGeometry(buildConvexSurfaceHull(points));
  } else {
    return Shape.fromGeometry(buildConvexHull(points));
  }
};

const HullMethod = function (...shapes) {
  return Hull(this, ...shapes);
};
Shape.prototype.Hull = HullMethod;

Hull.signature = 'Hull(shape:Shape, ...shapes:Shape) -> Shape';
HullMethod.signature = 'Shape -> Hull(...shapes:Shape) -> Shape';

export default Hull;
