import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from '@jsxcad/math-mat4';

import { canonicalize } from './canonicalize.js';
import { cutTrianglesByPlane } from './cutTrianglesByPlane.js';
import { doesNotOverlap } from './doesNotOverlap.js';
import { eachPoint } from './eachPoint.js';
import { flip } from './flip.js';
import { fromPointsAndPaths } from './fromPointsAndPaths.js';
import { isTriangle } from './isTriangle.js';
import { map } from './map.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { measureBoundingSphere } from './measureBoundingSphere.js';
import { pushWhenValid } from './pushWhenValid.js';
import { toGeneric } from './toGeneric.js';
import { toLoops } from './toLoops.js';
import { toPoints } from './toPoints.js';
import { toTriangles } from './toTriangles.js';
import { transform } from './transform.js';

const rotateX = (angle, polygons) => transform(fromXRotation(angle), polygons);
const rotateY = (angle, polygons) => transform(fromYRotation(angle), polygons);
const rotateZ = (angle, polygons) => transform(fromZRotation(angle), polygons);
const scale = (vector, polygons) => transform(fromScaling(vector), polygons);
const translate = (vector, polygons) =>
  transform(fromTranslation(vector), polygons);

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
  translate,
};
