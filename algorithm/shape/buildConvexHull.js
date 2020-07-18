import QuickHull from 'quickhull3d';
import { cache } from '@jsxcad/cache';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

const buildConvexHullImpl = (points) => {
  const faces = QuickHull(points, { skipTriangulation: true });
  const polygons = faces.map((polygon) =>
    polygon.map((nthPoint) => points[nthPoint])
  );
  polygons.isConvex = true;
  return { type: 'solid', solid: fromPolygonsToSolid(polygons) };
};

export const buildConvexHull = cache(buildConvexHullImpl);
