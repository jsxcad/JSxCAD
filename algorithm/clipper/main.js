import { difference } from './difference';
import { intersection } from './intersection';
import { intersectionOfPathsBySurfaces } from './intersectionOfPathsBySurfaces';
import { makeConvex } from './makeConvex';
import { union } from './union';

const clean = (surface) => union(surface, surface);

export {
  clean,
  difference,
  intersection,
  intersectionOfPathsBySurfaces,
  makeConvex,
  union
};
