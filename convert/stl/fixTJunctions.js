import { distance, equals } from '@jsxcad/math-vec3';

const copy = ({ solid }) => ({ solid: solid.map(surface => surface.map(path => path.map(point => [...point]))) });

// FIX: This is neither efficient nor principled.
// We include this fix for now to better understand the cases where it fails.

// FIX: This introduces degenerate polygons.

export const fixTJunctions = (solids) => {
  const points = new Map();

  for (const { solid } of solids) {
    for (const surface of solid) {
      for (const path of surface) {
        for (const point of path) {
          points.set(JSON.stringify(point), point);
        }
      }
    }
  }

  const fixed = [];

  for (const geometry of solids) {
    const { solid } = copy(geometry);
    for (const surface of solid) {
      for (const path of surface) {
        let last = path.length - 1;
        for (let current = 0; current < path.length; last = current++) {
          const start = path[last];
          const end = path[current];
          const span = distance(start, end);
          const colinear = [];
          for (const [, point] of points) {
            if (equals(point, start)) continue;
            if (equals(point, end)) continue;
            if (distance(start, point) + distance(point, end) === span) {
              // The point is approximately colinear.
              colinear.push(point);
            }
          }
          colinear.sort((a, b) => distance(start, a) - distance(start, b));
          path.splice(current, 0, ...colinear);
          current += colinear.length;
        }
      }
    }
    fixed.push({ solid });
  }

  return fixed;
};
