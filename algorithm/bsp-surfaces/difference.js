import { build } from './build';
import { clipTo } from './clipTo';
import { flip } from './flip';
import { fromSurfaces } from './fromSurfaces';
import { measureBoundingBox } from '@jsxcad/geometry-solid';
import { toSurfaces } from './toSurfaces';

const iota = 1e-5;
const X = 0;
const Y = 1;
const Z = 2;

// Tolerates overlap up to one iota.
const doesNotOverlap = (a, b) => {
  const [minA, maxA] = measureBoundingBox(a);
  const [minB, maxB] = measureBoundingBox(b);
  if (maxA[X] <= minB[X] + iota) { return true; }
  if (maxA[Y] <= minB[Y] + iota) { return true; }
  if (maxA[Z] <= minB[Z] + iota) { return true; }
  if (maxB[X] <= minA[X] + iota) { return true; }
  if (maxB[Y] <= minA[Y] + iota) { return true; }
  if (maxB[Z] <= minA[Z] + iota) { return true; }
  return false;
};

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
