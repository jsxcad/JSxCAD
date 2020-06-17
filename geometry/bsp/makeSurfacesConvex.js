import { makeSurfacesConvex as makeSurfacesConvexOfSolid } from '@jsxcad/geometry-solid';

export const makeSurfacesConvex = (solid) => {
  return makeSurfacesConvexOfSolid({}, solid);
};
