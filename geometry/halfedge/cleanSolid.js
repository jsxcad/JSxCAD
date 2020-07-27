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

export const fromSolidToCleanSolid = (solid, normalize) =>
  fromLoopsToCleanSolid(
    fromSolid(
      solid,
      normalize,
      /* closed= */ true
    ),
    junctionSelector(fromSolidToJunctions(solid, normalize)),
    normalize,
  );

export const fromPolygonsToCleanSolid = (polygons, normalize) =>
  fromLoopsToCleanSolid(
    fromPolygons(
      polygons,
      normalize,
      /* closed= */ true
    ),
    junctionSelector(fromPolygonsToJunctions(polygons, normalize)),
    normalize,
  );

export const fromLoopsToCleanSolid = (loops, selectJunction, normalize) => {
  const mergedLoops = merge(loops);
  /** @type {Edge[]} */
  const cleanedLoops = mergedLoops.map(clean);
  const splitLoops = split(cleanedLoops);
  const cleanedSolid = toSolid(splitLoops, selectJunction);
  return cleanedSolid;
};
