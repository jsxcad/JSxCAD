import { build } from './build';
import { clipTo } from './clipTo';
import { fromPolygons } from './fromPolygons';
import { invert } from './invert';
import { isDegenerate } from '@jsxcad/algorithm-triangles';
import { toPolygons } from './toPolygons';

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
  // TODO: Figure out why we do not subtract the union of the remainder of
  // the geometries. This approach chains subtractions rather than producing
  // a generational tree.
  for (let i = 0; i < subtractions.length; i++) {
    const baseBsp = fromPolygons({}, base);
    const subtractBsp = fromPolygons({}, subtractions[i]);

    invert(baseBsp);
    clipTo(baseBsp, subtractBsp);
    if (toPolygons({}, baseBsp).some(isDegenerate)) throw Error('die');
    if (toPolygons({}, subtractBsp).some(isDegenerate)) throw Error('die');
    clipTo(subtractBsp, baseBsp); // Found degenerate triangle here.

    invert(subtractBsp);
    clipTo(subtractBsp, baseBsp);
    invert(subtractBsp);

    build(baseBsp, toPolygons({}, subtractBsp));
    invert(baseBsp);

    // PROVE: That the round-trip to polygons and back is unnecessary for the intermediate stages.
    base = toPolygons({}, baseBsp);
  }
  return base;
};
