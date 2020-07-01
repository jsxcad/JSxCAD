import { difference } from './difference.js';
import { intersection } from './intersection.js';
import { intersectionOfPathsBySurfaces } from './intersectionOfPathsBySurfaces.js';
import { makeConvex } from './makeConvex.js';
import { reorient } from './reorient.js';
import { union } from './union.js';

const outline = reorient;

export {
  outline,
  difference,
  intersection,
  intersectionOfPathsBySurfaces,
  makeConvex,
  reorient,
  union,
};
