import { assertUnique } from '@jsxcad/geometry-path';
import { toPlane } from '@jsxcad/math-poly3';

export const assertGood = (surface) => {
  for (const path of surface) {
    assertUnique(path);
    if (false && path.plane === undefined) {
      throw Error('die: no plane');
    }
    if (isNaN(toPlane(path)[0])) {
      throw Error('die');
    }
  }
};
