import { equals } from "@jsxcad/math-vec3";

export const assertUnique = (path) => {
  let last = null;
  for (const point of path) {
    if (point === undefined) {
      throw Error(`die: ${JSON.stringify(path)}`);
    }
    if (last !== null && equals(point, last)) {
      throw Error(`die: ${JSON.stringify(path)}`);
    }
    last = point;
  }
};
