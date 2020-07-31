import './types.js';

import clean from './clean.js';
import fromSurface from './fromSurface.js';
import merge from './merge.js';
import split from './split.js';
import toSurface from './toSurface.js';

export const fromSurfaceToCleanSurface = (
  surface,
  normalize,
  isJunction = (point) => true
) =>
  fromLoopsToCleanSurface(
    fromSurface(surface, normalize, /* closed= */ false),
    isJunction,
    normalize
  );

export const fromLoopsToCleanSurface = (loops, normalize, isJunction) => {
  const mergedLoops = merge(loops);
  /** @type {Edge[]} */
  const cleanedLoops = mergedLoops.map(clean);
  const splitLoops = split(cleanedLoops);
  const cleanedSurface = toSurface(splitLoops, isJunction);
  return cleanedSurface;
};
