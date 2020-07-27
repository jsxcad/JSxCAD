import './types.js';

import { fromSurfaceToJunctions, junctionSelector } from './junction.js';

import clean from './clean.js';
import fromSurface from './fromSurface.js';
import merge from './merge.js';
import split from './split.js';
import toSurface from './toSurface.js';

export const fromSurfaceToCleanSurface = (surface, normalize) =>
  fromLoopsToCleanSurface(
    fromSurface(surface, normalize, /* closed= */ false),
    /* junctionSelector= */ (_) => true,
    normalize
  );

export const fromLoopsToCleanSurface = (loops, selectJunction, normalize) => {
  const mergedLoops = merge(loops);
  /** @type {Edge[]} */
  const cleanedLoops = mergedLoops.map(clean);
  const splitLoops = split(cleanedLoops);
  const cleanedSurface = toSurface(splitLoops, selectJunction);
  return cleanedSurface;
};
