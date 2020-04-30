import { merge, split } from './merge';

import fromSolid from './fromSolid';
import { junctionSelector } from './junction';
import toSolid from './toSolid';

/**
 * @typedef {Array} Solid
 */

/**
 * CleanSolid produces a defragmented version of a solid, while maintaining watertightness.
 *
 * @param {Solid} solid
 * @param {Function} normalize
 * @returns {Solid}
 */
export const cleanSolid = (solid, normalize) => {
  for (const surface of solid) {
    console.log(`QQ/surface/length: ${surface.length}`);
  }
  const loops = fromSolid(solid, normalize, /* closed= */true);
  console.log(`QQ/loops/length: ${loops.length}`);
  const selectJunction = junctionSelector(solid, normalize);
  const merged = merge(loops);
  const splitted = split(merged);
  return toSolid(splitted, selectJunction);
  // return toSolid(merged, n => true);
};

export default cleanSolid;
