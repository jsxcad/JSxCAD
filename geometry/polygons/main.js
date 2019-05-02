import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { canonicalize } from './canonicalize';
import { cutTrianglesByPlane } from './cutTrianglesByPlane';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fromPointsAndPaths } from './fromPointsAndPaths';
import { isTriangle } from './isTriangle';
import { makeConvex } from './makeConvex';
import { map } from './map';
import { measureBoundingBox } from './measureBoundingBox';
import { measureBoundingSphere } from './measureBoundingSphere';
import { toGeneric } from './toGeneric';
import { toPoints } from './toPoints';
import { toTriangles } from './toTriangles';
import { transform } from './transform';

const rotateX = (angle, polygons) => transform(fromXRotation(angle), polygons);
const rotateY = (angle, polygons) => transform(fromYRotation(angle), polygons);
const rotateZ = (angle, polygons) => transform(fromZRotation(angle), polygons);
const scale = (vector, polygons) => transform(fromScaling(vector), polygons);
const translate = (vector, polygons) => transform(fromTranslation(vector), polygons);

export {
  canonicalize,
  cutTrianglesByPlane,
  eachPoint,
  flip,
  fromPointsAndPaths,
  isTriangle,
  makeConvex,
  map,
  measureBoundingBox,
  measureBoundingSphere,
  toGeneric,
  toPoints,
  toTriangles,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  transform,
  translate
};
