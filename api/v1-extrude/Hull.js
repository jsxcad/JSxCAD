/*
import {
  buildConvexHull,
  buildConvexSurfaceHull,
} from '@jsxcad/algorithm-shape';
import { taggedSolid, taggedSurface } from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';

const Z = 2;

export const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  // FIX: Detect planar hulls properly.
  if (points.every((point) => point[Z] === 0)) {
    return Shape.fromGeometry(
      taggedSurface({}, buildConvexSurfaceHull(points))
    );
  } else {
    return Shape.fromGeometry(taggedSolid({}, buildConvexHull(points)));
  }
};
*/

import { Shape } from '@jsxcad/api-v1-shape';
import { convexHull } from '@jsxcad/geometry-graph';
import { taggedGraph } from '@jsxcad/geometry-tagged';

export const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  return Shape.fromGeometry(taggedGraph({}, convexHull(points)));
};

const hullMethod = function (...shapes) {
  return Hull(this, ...shapes);
};
Shape.prototype.hull = hullMethod;

export default Hull;
