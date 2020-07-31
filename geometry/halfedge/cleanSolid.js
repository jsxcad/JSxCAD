import './types.js';

import {
  fromPolygonsToJunctions,
  fromSolidToJunctions,
  junctionSelector,
} from './junction.js';

import clean from './clean.js';
import fromPolygons from './fromPolygons.js';
import fromSolid from './fromSolid.js';
import merge from './merge.js';
import split from './split.js';
import toSolid from './toSolid.js';

/**
 * CleanSolid produces a defragmented version of a solid, while maintaining watertightness.
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @returns {Solid}
 */

export const fromSolidToCleanSolid = (
  solid,
  normalize,
  isJunction = junctionSelector(fromSolidToJunctions(solid, normalize))
) =>
  fromLoopsToCleanSolid(
    fromSolid(solid, normalize, /* closed= */ true),
    normalize,
    isJunction
  );

export const fromPolygonsToCleanSolid = (
  polygons,
  normalize,
  isJunction = junctionSelector(fromPolygonsToJunctions(polygons, normalize))
) =>
  fromLoopsToCleanSolid(
    fromPolygons(polygons, normalize, /* closed= */ true),
    isJunction,
    normalize
  );

export const fromLoopsToCleanSolid = (loops, normalize, isJunction) => {
  const mergedLoops = merge(loops);
  /** @type {Edge[]} */
  const cleanedLoops = mergedLoops.map(clean);
  const splitLoops = split(cleanedLoops);
  const cleanedSolid = toSolid(splitLoops, isJunction);
  return cleanedSolid;
};
