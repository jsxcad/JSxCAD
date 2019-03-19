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

export const rotateX = (angle, polygons) => transform(fromXRotation(angle), polygons);
export const rotateY = (angle, polygons) => transform(fromYRotation(angle), polygons);
export const rotateZ = (angle, polygons) => transform(fromZRotation(angle), polygons);
export const scale = (vector, polygons) => transform(fromScaling(vector), polygons);
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
  rotateX,
  rotateY,
  rotateZ,
  transform,
  translate
};
