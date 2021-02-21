import { arrangePaths, insetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';

export const inset = (plane, paths, initial, step, limit) => {
  const [x = 0, y = 0, z = 1, w = 0] = plane;
  const output = [];
  for (const polygonWithHoles of arrangePaths(x, y, z, w, paths)) {
    for (const { points, holes } of insetOfPolygonWithHoles(
      initial,
      step,
      limit,
      [x, y, z, w],
      polygonWithHoles
    )) {
      output.push(points);
      for (const { points } of holes) {
        output.push(points);
      }
    }
  }
  return output;
};
