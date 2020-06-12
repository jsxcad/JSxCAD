import { fromPoints } from "@jsxcad/math-poly3";

export const fromPointsAndPaths = ({ points = [], paths = [] }) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push(fromPoints(path.map((nth) => points[nth])));
  }
  return polygons;
};
