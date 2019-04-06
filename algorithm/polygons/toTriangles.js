import { blessAsTriangles } from './blessAsTriangles';
import { isTriangle } from './isTriangle';

export const toTriangles = (options = {}, paths) => {
console.log(paths);
  if (paths.isTriangles) {
    return paths;
  }
  if (paths.every(isTriangle)) {
    return blessAsTriangles(paths);
  }
  const triangles = [];
  for (const path of paths) {
    for (let nth = 2; nth < path.length; nth++) {
      triangles.push([path[0], path[nth - 1], path[nth]]);
    }
  }
  return blessAsTriangles(triangles);
};
