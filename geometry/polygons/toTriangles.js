import { blessAsTriangles } from './blessAsTriangles';
import { equals } from '@jsxcad/math-vec3';
import { toPlane } from '@jsxcad/math-poly3';

export const toTriangles = (options = {}, paths) => {
  if (paths.isTriangles) {
    return paths;
  }
  const triangles = [];
  for (const path of paths) {
    const a = path[0];
    for (let nth = 2; nth < path.length; nth++) {
      const b = path[nth - 1];
      const c = path[nth];
      if (equals(a, b) || equals(a, c) || equals(b, c)) {
        // Skip degenerate triangles introduced by colinear points.
        continue;
      }
      const triangle = [a, b, c];
      if (isNaN(toPlane(triangle)[0])) {
        // FIX: Why isn't this degeneracy detected above?
        // Skip degenerate triangles introduced by colinear points.
        continue;
      }
      triangles.push([a, b, c]);
    }
  }
  return blessAsTriangles(triangles);
};
