import { equals } from '@jsxcad/math-vec3';

export const assertUnique = (path) => {
  let last = null;
  for (const point of path) {
    if (last !== null && equals(point, last)) {
      throw Error('die');
    }
    last = point;
  }
}

