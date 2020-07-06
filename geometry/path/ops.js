import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from '@jsxcad/math-mat4';

import { transform } from './transform.js';

export const translate = (vector, path) =>
  transform(fromTranslation(vector), path);
export const rotateX = (radians, path) =>
  transform(fromXRotation(radians), path);
export const rotateY = (radians, path) =>
  transform(fromYRotation(radians), path);
export const rotateZ = (radians, path) =>
  transform(fromZRotation(radians), path);
export const scale = (vector, path) => transform(fromScaling(vector), path);
