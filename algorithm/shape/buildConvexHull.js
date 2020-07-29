import QuickHull from 'quickhull3d';
import { cache } from '@jsxcad/cache';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

/** @type function(Points):Solid */
const buildConvexHullImpl = (points) => {
  const faces = QuickHull(points, { skipTriangulation: false });
  const polygons = faces.map((polygon) =>
    polygon.map((nthPoint) => points[nthPoint])
  );
  polygons.isConvex = true;
  return fromPolygonsToSolid(polygons);
};

/**
 * Constructs a convex hull from the points given.
 * @type function(Points):Solid
 */
export const buildConvexHull = cache(buildConvexHullImpl);
