import { fromPoints } from '@jsxcad/math-poly3';

/** @type {function(Point[], Path[]):Triangle[]} */
export const fromPointsAndPaths = (points = [], paths = []) => {
  /** @type {Polygon[]} */
  const polygons = [];
  for (const path of paths) {
    polygons.push(fromPoints(path.map((nth) => points[nth])));
  }
  return polygons;
};
