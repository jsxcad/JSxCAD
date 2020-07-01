/**
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

import clean from './clean.js';
import fromSolid from './fromSolid.js';
import merge from './merge.js';
import split from './split.js';
import toPolygons from './toPolygons.js';

/**
 * Produces the outline of a solid.
 *
 * @function
 * @param {Surface} surface
 * @param {Normalizer} normalize
 * @returns {Surface}
 */
export const outlineSolid = (solid, normalize) => {
  const loops = fromSolid(solid, normalize);
  const mergedLoops = merge(loops);
  const cleanedLoops = mergedLoops.map(clean);
  const splitLoops = split(cleanedLoops);
  return toPolygons(splitLoops);
};

export default outlineSolid;
