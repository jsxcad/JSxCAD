import { assertUnique } from '@jsxcad/geometry-path';
import { toPlane } from '@jsxcad/math-poly3';

export const assertGood = (surface) => {
  for (const path of surface) {
console.log(`QQ/path: ${JSON.stringify(path)}`);
    assertUnique(path);
    if (isNaN(toPlane(path)[0])) {
      throw Error('die');
    }
  }
}
