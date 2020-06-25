import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from '@jsxcad/math-mat4';

import { transform as transformSurface } from '@jsxcad/geometry-surface';

export const transform = (matrix, solid) =>
  solid.map((surface) => transformSurface(matrix, surface));

export const rotateX = (radians, solid) =>
  transform(fromXRotation(radians), solid);
export const rotateY = (radians, solid) =>
  transform(fromYRotation(radians), solid);
export const rotateZ = (radians, solid) =>
  transform(fromZRotation(radians), solid);
export const scale = (vector, solid) => transform(fromScaling(vector), solid);
export const translate = (vector, solid) =>
  transform(fromTranslation(vector), solid);
