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
  // console.log(`mergedLoops`);
  // console.log(toDot(mergedLoops));
  const cleanedLoops = clean(mergedLoops);
  // console.log(`cleanedLoops`);
  // console.log(toDot(cleanedLoops));
  const splitLoops = split(cleanedLoops);
  // console.log(`splitLoops`);
  // console.log(toDot(splitLoops));
  return toPolygons(splitLoops);
};

export default outlineSurface;
