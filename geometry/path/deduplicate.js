import { equals } from '@jsxcad/math-vec3';

export const deduplicate = (path) => {
  const unique = [];
  let last = path[path.length - 1];
  for (const point of path) {
    if (last === null || point === null || !equals(point, last)) {
      unique.push(point);
    }
    last = point;
  }
  return unique;
};
