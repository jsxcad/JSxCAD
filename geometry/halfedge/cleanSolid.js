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
  const loops = fromSolid(solid, normalize, /* closed= */true);
  const selectJunction = junctionSelector(solid, normalize);
  const mergedLoops = merge(loops);
  const cleanedLoops = mergedLoops.map(clean);
  const splitLoops = split(cleanedLoops);
  return toSolid(splitLoops, selectJunction);
};

export default cleanSolid;
