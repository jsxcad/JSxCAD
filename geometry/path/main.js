import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { canonicalize } from './canonicalize';
import { close } from './close';
import { concatenate } from './concatenate';
import { flip } from './flip';
import { isClosed } from './isClosed';
import { measureArea } from './measureArea';
import { open } from './open';
import { toGeneric } from './toGeneric';
import { toPolygon } from './toPolygon';
import { toSegments } from './toSegments';
import { toZ0Polygon } from './toZ0Polygon';
import { transform } from './transform';

export {
  canonicalize,
  close,
  concatenate,
  flip,
  isClosed,
  measureArea,
  open,
  toGeneric,
  toPolygon,
  toSegments,
  toZ0Polygon,
  transform
};

export const translate = (vector, path) => transform(fromTranslation(vector), path);
export const rotateX = (radians, path) => transform(fromXRotation(radians), path);
export const rotateY = (radians, path) => transform(fromYRotation(radians), path);
export const rotateZ = (radians, path) => transform(fromZRotation(radians), path);
export const scale = (vector, path) => transform(fromScaling(vector), path);
