import { blessAsTriangles } from './blessAsTriangles';
import { isTriangle } from './isTriangle';
// import { makeConvex } from '@jsxcad/algorithm-polygons';

export const toTriangles = (options = {}, paths) => {
  if (paths.isTriangles) {
    return paths;
  }
  if (paths.every(isTriangle)) {
    return blessAsTriangles(paths);
  }
  const triangles = [];
  // Perform naive triangulation by fanning from the first vertex.
  // FIX: makeConvex is breaking example/v1/zobrist.js significantly -- find out why.
  // for (const path of makeConvex({}, paths)) {
  for (const path of paths) {
    for (let nth = 2; nth < path.length; nth++) {
      triangles.push([path[0], path[nth - 1], path[nth]]);
    }
  }
  return blessAsTriangles(triangles);
};
