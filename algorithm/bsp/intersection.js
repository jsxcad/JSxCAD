import { build } from './build';
import { clipTo } from './clipTo';
import { fromPolygons } from './fromPolygons';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { invert } from './invert';
import { toPolygons } from './toPolygons';

/**
 * Return a solid representing filled volume present in all provided solids.
 * A pairwise generational reduction is used.
 * @param {Array<Polygons>} solids - list Polygons.
 * @returns {Polygons} the resulting solid.
 * @example
 * let C = intersection(A, B)
 * @example
 * +--------+
 * |        |
 * |   A    |
 * |    +---+----+       +---+
 * |    |   |    |   =   + C +
 * +----+---+    |       +---+
 *      |    B   |
 *      |        |
 *      +--------+
 */
export const intersection = (...solids) => {
  // Run a queue so that intersections are generally against intersections of the same generation.
  while (solids.length > 1) {
    const aSolid = solids.shift();
    if (!isWatertightPolygons(aSolid)) { throw Error('Not watertight'); }
    const bSolid = solids.shift();
    if (!isWatertightPolygons(bSolid)) { throw Error('Not watertight'); }

    const aBsp = fromPolygons({}, aSolid);
    const bBsp = fromPolygons({}, bSolid);

    invert(aBsp);
    clipTo(bBsp, aBsp);

    invert(bBsp);
    clipTo(aBsp, bBsp);
    clipTo(bBsp, aBsp);
    build(aBsp, toPolygons({}, bBsp));

    invert(aBsp);

    // Push back for the next generation.
    solids.push(toPolygons({}, aBsp));
  }
  return solids[0];
};
