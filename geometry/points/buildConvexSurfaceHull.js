import ConvexHull2d from 'monotone-convex-hull-2d';

export const buildConvexSurfaceHull = (options = {}, points) => {
  const hull = [];
  for (const nth of ConvexHull2d(points)) {
    hull.push(points[nth]);
  }
  return hull.reverse();
};
