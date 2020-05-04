/** @module @jsxcad/geometry-halfedge/cleanSolid */

/**
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

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
  for (const surface of solid) {
    console.log(`QQ/surface/length: ${surface.length}`);
  }
  const loops = fromSolid(solid, normalize, /* closed= */true);
  console.log(`QQ/loops/length: ${loops.length}`);
  const selectJunction = junctionSelector(solid, normalize);
  const merged = merge(loops);
  // const splitted = split(merged.slice(4, 5));
  const splitted = split([merged[4]]);
  return toSolid(splitted, selectJunction);
  // return toSolid(merged, n => true);
};

export default cleanSolid;
