import { eachPoint } from './eachPoint';
import { fromPolygons } from './fromPolygons';
import { makeSurfacesConvex } from './makeSurfacesConvex';
import { makeSurfacesSimple } from './makeSurfacesSimple';
import { measureBoundingBox } from './measureBoundingBox';
import { measureBoundingSphere } from './measureBoundingSphere';
import { toGeneric } from './toGeneric';
import { toPoints } from './toPoints';
import { toPolygons } from './toPolygons';

import { canonicalize as canonicalizeSurface, transform as transformSurface } from '@jsxcad/algorithm-surface';

export {
  eachPoint,
  fromPolygons,
  makeSurfacesConvex,
  makeSurfacesSimple,
  measureBoundingBox,
  measureBoundingSphere,
  toGeneric,
  toPoints,
  toPolygons
};
export const transform = (matrix, solid) => solid.map(surface => transformSurface(matrix, surface));
export const canonicalize = (solid) => solid.map(canonicalizeSurface);
