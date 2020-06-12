/**
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

import clean from "./clean";
import fromSolid from "./fromSolid";
import merge from "./merge";
import split from "./split";
import toPolygons from "./toPolygons";

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
