import { add, dot, scale, subtract } from '@jsxcad/math-vec3';

import { createOpenPath, getEdges } from '@jsxcad/geometry-path';

export const planeDistance = (plane, point) =>
  plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];

const splitPaths = (normalize, plan, paths, back, front) => {
  for (const path of paths) {
    splitPath(normalize, plan, path, back, front);
  }
};

// FIX: This chops up the path into discrete segments.
const splitPath = (normalize, plane, path, back, front) => {
  for (const [start, end] of getEdges(path)) {
    const t = planeDistance(plane, start);
    const direction = subtract(end, start);
    let lambda = (plane[3] - dot(plane, start)) / dot(plane, direction);
    if (!Number.isNaN(lambda) && lambda > 0 && lambda < 1) {
      const span = normalize(add(start, scale(lambda, direction)));
      if (t > 0) {
        // Front to back
        front.push(createOpenPath(start, span));
        back.push(createOpenPath(span, end));
      } else {
        back.push(createOpenPath(start, span));
        front.push(createOpenPath(span, end));
      }
    } else {
      if (t > 0) {
        front.push(createOpenPath(start, end));
      } else {
        back.push(createOpenPath(start, end));
      }
    }
  }
};

export { splitPaths };
export default splitPaths;
