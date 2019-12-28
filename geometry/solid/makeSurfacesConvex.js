import { alignVertices } from './alignVertices';
import { assertGood } from './assertGood';
import { makeConvex } from '@jsxcad/geometry-surface';

export const makeSurfacesConvex = (rawSolid) => {
  if (rawSolid.length === undefined) {
    throw Error('die');
  }
  if (rawSolid.convexSurfaces === undefined) {
    const solid = alignVertices(rawSolid);
    assertGood(solid);
    const convex = solid.map(surface => makeConvex(surface));
    rawSolid.convexSurfaces = alignVertices(convex);
  }
  return rawSolid.convexSurfaces;
};
