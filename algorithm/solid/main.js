import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fromPolygons } from './fromPolygons';
import { makeSurfacesConvex } from './makeSurfacesConvex';
import { makeSurfacesSimple } from './makeSurfacesSimple';
import { measureBoundingBox } from './measureBoundingBox';
import { measureBoundingSphere } from './measureBoundingSphere';
import { toGeneric } from './toGeneric';
import { toPoints } from './toPoints';
import { toPolygons } from './toPolygons';
import { canonicalize as canonicalizeSurface, transform as transformSurface } from '@jsxcad/algorithm-surface';
import { fromScaling } from '@jsxcad/math-mat4';

export {
  eachPoint,
  flip,
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
export const scale = (vector, solid) => transform(fromScaling(vector), solid);
export const canonicalize = (solid) => solid.map(canonicalizeSurface);
