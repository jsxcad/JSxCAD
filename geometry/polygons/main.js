import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { canonicalize } from './canonicalize';
import { cutTrianglesByPlane } from './cutTrianglesByPlane';
import { doesNotOverlap } from './doesNotOverlap';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fromPointsAndPaths } from './fromPointsAndPaths';
import { isTriangle } from './isTriangle';
import { map } from './map';
import { measureBoundingBox } from './measureBoundingBox';
import { measureBoundingSphere } from './measureBoundingSphere';
import { pushWhenValid } from './pushWhenValid';
import { toGeneric } from './toGeneric';
import { toLoops } from './toLoops';
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
  doesNotOverlap,
  eachPoint,
  flip,
  fromPointsAndPaths,
  isTriangle,
  map,
  measureBoundingBox,
  measureBoundingSphere,
  pushWhenValid,
  toGeneric,
  toLoops,
  toPoints,
  toTriangles,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  transform,
  translate
};
