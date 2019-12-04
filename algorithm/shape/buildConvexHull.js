import QuickHull from './quickhull3d/dist/QuickHull';
import { cache } from '@jsxcad/cache';
import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

const buildConvexHullImpl = (points) => {
  const hull = new QuickHull(points, { skipTriangulation: true });
  hull.build();
  const polygons = hull.collectFaces().map(polygon => polygon.map(nthPoint => points[nthPoint]));
  polygons.isConvex = true;
  return { solid: toSolidFromPolygons({}, polygons) };
};

export const buildConvexHull = cache(buildConvexHullImpl);
