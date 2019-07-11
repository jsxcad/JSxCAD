import { doesNotOverlap } from '@jsxcad/geometry-solid';
import { flip } from './flip';
import { fromSolid } from './fromSolid';
import { removeInterior } from './removeInterior';
import { toSolid } from './toSolid';

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
    const bSolid = solids.shift();

    if (doesNotOverlap(aSolid, bSolid)) {
      // Once we produce an empty geometry, all further intersections must be empty.
      return [];
    }

    const a = fromSolid(aSolid);
    const b = fromSolid(bSolid);

    const aFlipped = flip(a);
    const bFlipped = flip(b);
    const aClipped = removeInterior(aFlipped, bFlipped);
    const bClipped = removeInterior(bFlipped, aFlipped);

    solids.push([...toSolid(flip(aClipped)), ...toSolid(flip(bClipped))]);
  }
  return solids[0];
};
