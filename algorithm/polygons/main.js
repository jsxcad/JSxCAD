import { canonicalize } from './canonicalize';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fromPointsAndPaths } from './fromPointsAndPaths';
import { fromTranslation } from '@jsxcad/math-mat4';
import { makeConvex } from './makeConvex';
import { map } from './map';
import { measureBoundingBox } from './measureBoundingBox';
import { measureBoundingSphere } from './measureBoundingSphere';
import { toGeneric } from './toGeneric';
import { toPoints } from './toPoints';
import { transform } from './transform';

export const translate = (vector, polygons) => transform(fromTranslation(vector), polygons);

export {
  canonicalize,
  eachPoint,
  flip,
  fromPointsAndPaths,
  makeConvex,
  map,
  measureBoundingBox,
  measureBoundingSphere,
  toGeneric,
  toPoints,
  transform
};
