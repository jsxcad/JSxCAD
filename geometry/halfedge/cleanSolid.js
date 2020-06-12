/**
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

import clean from './clean';
import fromSolid from './fromSolid';
import { junctionSelector } from './junction';
import merge from './merge';
import split from './split';
import toSolid from './toSolid';

/**
 * CleanSolid produces a defragmented version of a solid, while maintaining watertightness.
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @returns {Solid}
 */
export const cleanSolid = (solid, normalize) => {
  // This is currently a best-effort operation, to support solids that are not
  // properly 2-manifold.
  try {
    const loops = fromSolid(solid, normalize, /* closed= */true);
    const selectJunction = junctionSelector(solid, normalize);
    const mergedLoops = merge(loops);
    const cleanedLoops = mergedLoops.map(clean);
    const splitLoops = split(cleanedLoops);
    const cleanedSolid = toSolid(splitLoops, selectJunction);
    return cleanedSolid;
  } catch (e) {
    return solid;
  }
};

export default cleanSolid;
