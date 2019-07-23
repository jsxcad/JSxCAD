import { equals } from '@jsxcad/math-vec3';

export const deduplicate = (path) => {
  const unique = [];
  let last = null;
  for (const point of path) {
    if (last === null || !equals(point, last)) {
      unique.push(point);
    }
    last = point;
  }
  return unique;
}

