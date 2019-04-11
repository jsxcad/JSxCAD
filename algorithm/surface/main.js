import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { makeConvex } from './makeConvex';
import { makeSimple } from './makeSimple';
import { measureArea } from './measureArea';

import { canonicalize as canonicalizePolygon, transform as transformPolygon, toPlane as toPlaneOfPolygon } from '@jsxcad/math-poly3';

export {
  eachPoint,
  flip,
  makeConvex,
  makeSimple,
  measureArea
};

export const transform = (matrix, surface) => surface.map(polygon => transformPolygon(matrix, polygon));
export const toPlane = (surface) => toPlaneOfPolygon(surface[0]);
export const canonicalize = (surface) => surface.map(canonicalizePolygon);
