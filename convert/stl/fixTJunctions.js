import { add, distance, equals, length, scale, subtract } from '@jsxcad/math-vec3';
import { assertUnique, deduplicate } from '@jsxcad/geometry-path';

import createTree from 'yaot';
import { eachPoint } from '@jsxcad/geometry-solid';

const copy = ({ solid }) => ({ solid: solid.map(surface => surface.map(path => path.map(point => [...point]))) });

// FIX: This is neither efficient nor principled.
// We include this fix for now to better understand the cases where it fails.

export const fixTJunctions = (solids) => {
  const tree = createTree();
  const points = [];
  for (const { solid } of solids) {
    eachPoint({}, point => points.push(...point), solid);
  }
  tree.init(points);

  const fixed = [];
  for (const geometry of solids) {
    const { solid } = copy(geometry);
    for (let nthSurface = 0; nthSurface < solid.length; nthSurface++) {
      const surface = solid[nthSurface];
      for (let nthPath = 0; nthPath < surface.length; nthPath++) {
        const path = surface[nthPath];
        let last = path.length - 1;
        for (let current = 0; current < path.length; last = current++) {
          const start = path[last];
          const end = path[current];
          const midpoint = scale(0.5, add(start, end));
          const direction = subtract(end, start);
          const span = length(direction);
          const matches = tree.intersectSphere(...midpoint, span / 2 + 1);
          const colinear = [];
          for (const match of matches) {
            const point = points.slice(match, match + 3);
            if (equals(point, start)) continue;
            if (equals(point, end)) continue;
            if (distance(start, point) + distance(point, end) === span) {
              // The point is approximately colinear and upon the segment.
              colinear.push(point);
            }
          }
          colinear.sort((a, b) => distance(start, a) - distance(start, b));
          path.splice(current, 0, ...colinear);
          current += colinear.length;
        }
        surface[nthPath] = deduplicate(path);
        assertUnique(surface[nthPath]);
      }
    }
    fixed.push({ solid });
  }
  return fixed;
};
