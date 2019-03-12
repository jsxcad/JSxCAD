import { build } from './build';
import { canonicalize } from '@jsxcad/algorithm-polygons';
import { clipTo } from './clipTo';
import { fromPolygons } from './fromPolygons';
import { invert } from './invert';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
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
    // if (!isWatertightPolygons(base)) { throw Error('Not watertight'); }
    const baseBsp = fromPolygons({}, base);
console.log(`QQ/difference/base: ${JSON.stringify(base)}`);
    // if (!isWatertightPolygons(subtractions[i])) { throw Error('Not watertight'); }
    const subtractBsp = fromPolygons({}, subtractions[i]);
console.log(`QQ/difference/subtract: ${JSON.stringify(subtractions[i])}`);

    invert(baseBsp);
    // if (!isWatertightPolygons(toPolygons({}, baseBsp))) { throw Error('Not watertight'); }
    clipTo(baseBsp, subtractBsp);
    // if (!isWatertightPolygons(canonicalize(toPolygons({}, baseBsp)))) { throw Error('Not watertight'); }
    clipTo(subtractBsp, baseBsp);
    // if (!isWatertightPolygons(toPolygons({}, subtractBsp))) { throw Error('Not watertight'); }

    invert(subtractBsp);
    // if (!isWatertightPolygons(toPolygons({}, subtractBsp))) { throw Error('Not watertight'); }
    clipTo(subtractBsp, baseBsp);
    // if (!isWatertightPolygons(toPolygons({}, subtractBsp))) { throw Error('Not watertight'); }
    invert(subtractBsp);
    // if (!isWatertightPolygons(toPolygons({}, subtractBsp))) { throw Error('Not watertight'); }

    build(baseBsp, toPolygons({}, subtractBsp));
    // if (!isWatertightPolygons(toPolygons({}, baseBsp))) { throw Error('Not watertight'); }
    invert(baseBsp);

    // PROVE: That the round-trip to polygons and back is unnecessary for the intermediate stages.
    base = toPolygons({}, baseBsp);
    // if (!isWatertightPolygons(base)) { throw Error('Not watertight'); }
console.log(`QQ/difference/base/out: ${JSON.stringify(base)}`);
  }
  return base;
};
