const poly3 = require('@jsxcad/math-poly3');

const fromPointsAndPaths = ({ points = [], paths = [] }) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push(poly3.fromPoints(path.map(nth => points[nth])));
  }
  return polygons;
};

module.exports = fromPointsAndPaths;
