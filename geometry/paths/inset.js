import { arrangePaths, insetOfPolygon } from '@jsxcad/algorithm-cgal';

export const inset = (plane, paths, initial, step, limit) => {
  const [x = 0, y = 0, z = 1, w = 0] = plane;
  const output = [];
  for (const { boundary: inputBoundary, holes: inputHoles } of arrangePaths(
    x,
    y,
    z,
    w,
    paths
  )) {
    for (const { boundary, holes } of insetOfPolygon(
      initial,
      step,
      limit,
      [x, y, z, w],
      inputBoundary,
      inputHoles
    )) {
      output.push(boundary);
      output.push(...holes);
    }
  }
  return output;
};
