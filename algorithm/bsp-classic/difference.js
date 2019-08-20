import { build } from './build';
import { clipTo } from './clipTo';
import { doesNotOverlap } from '@jsxcad/geometry-solid';
import { flip } from './flip';
import { fromSurfaces } from './fromSurfaces';
import { toSurfaces } from './toSurfaces';
import { union } from './union';

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
  if (subtractions.length >= 2) {
    subtractions = [union(...subtractions)];
  }
  // TODO: Figure out why we do not subtract the union of the remainder of
  // the geometries. This approach chains subtractions rather than producing
  // a generational tree.
  for (let i = 0; i < subtractions.length; i++) {
    if (subtractions[i].length === 0) {
      // Nothing to do.
      continue;
    }
    if (doesNotOverlap(base, subtractions[i])) {
      // Nothing to do.
      continue;
    }
    const baseBsp = fromSurfaces({}, base);
    const subtractBsp = fromSurfaces({}, subtractions[i]);

    flip(baseBsp);
    clipTo(baseBsp, subtractBsp);
    clipTo(subtractBsp, baseBsp);

    flip(subtractBsp);
    clipTo(subtractBsp, baseBsp);
    flip(subtractBsp);

    build(baseBsp, toSurfaces({}, subtractBsp));
    flip(baseBsp);

    // PROVE: That the round-trip to solids and back is unnecessary for the intermediate stages.
    base = toSurfaces({}, baseBsp);
  }
  return base;
};
