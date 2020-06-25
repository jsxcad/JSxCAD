/**
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

import clean from './clean';
import fromSurface from './fromSurface';
import merge from './merge';
import split from './split';
import toPolygons from './toPolygons';

/**
 * Produces the outline of a surface.
 *
 * @function
 * @param {Surface} surface
 * @param {Normalizer} normalize
 * @returns {Surface}
 */
export const outlineSurface = (surface, normalize) => {
  const loops = fromSurface(surface, normalize);
  const mergedLoops = merge(loops);
  const cleanedLoops = mergedLoops.map(clean);
  const splitLoops = split(cleanedLoops);
  return toPolygons(splitLoops);
};

export default outlineSurface;
