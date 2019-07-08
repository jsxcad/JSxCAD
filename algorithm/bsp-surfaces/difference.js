import { doesNotOverlap } from '@jsxcad/geometry-solid';
import { flip } from './flip';
import { fromSolid } from './fromSolid';
import { removeExterior } from './removeExterior';
import { removeInterior } from './removeInterior';
import { toSolid } from './toSolid';

/**
   * Given a solid and a set of solids to subtract produce the resulting solid.
   * @param {Polygons} base - Polygons for the base to subtract from.
   * @param {Array<Polygons>} subtractions - a list of Polygons to subtract.
   * @returns {Polygons} the resulting Polygons.
   * @example
   * let C = difference(A, B);
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
export const difference = (base, ...subtractions) => {
  if (base.length === 0) {
    return base;
  }
  if (subtractions.length === 0) {
    return base;
  }
  for (let i = 0; i < subtractions.length; i++) {
    if (subtractions[i].length === 0) {
      // Nothing to do.
      continue;
    }
    if (doesNotOverlap(base, subtractions[i])) {
      // Nothing to do.
      continue;
    }

    const a = fromSolid(base);
    const b = fromSolid(subtractions[i]);

    const aClipped = removeInterior(a, b, true);
    const bClipped = removeExterior(b, a, true);

    base = [...toSolid(aClipped), ...toSolid(flip(bClipped))];
  }
  return base;
};
