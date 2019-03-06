const QuickHull = require('quickhull3d/dist/QuickHull');

const buildConvexHull = (options = {}, points) => {
  const hull = new QuickHull(points, { skipTriangulation: true });
  hull.build();
  return hull.collectFaces().map(polygon => polygon.map(nthPoint => points[nthPoint]));
};

module.exports = buildConvexHull;
