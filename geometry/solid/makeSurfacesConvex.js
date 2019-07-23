import { assertGood } from './assertGood';
import { makeConvex } from '@jsxcad/geometry-surface';

export const makeSurfacesConvex = (options = {}, solid) => {
  assertGood(solid);
  const convex = solid.map(surface => makeConvex(options, surface));
  return convex;
}
