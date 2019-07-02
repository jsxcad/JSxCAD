import QuickHull from 'quickhull3d/dist/QuickHull';

export const buildConvexHull = (options = {}, points) => {
  const hull = new QuickHull(points, { skipTriangulation: true });
  hull.build();
  const polygons = hull.collectFaces().map(polygon => polygon.map(nthPoint => points[nthPoint]));
  polygons.isConvex = true;
  return polygons;
};
