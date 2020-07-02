import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from '@jsxcad/math-mat4';

import { assertGood } from './assertGood.js';
import { assertUnique } from './assertUnique.js';
import { canonicalize } from './canonicalize.js';
import { close } from './close.js';
import { concatenate } from './concatenate.js';
import { deduplicate } from './deduplicate.js';
import { flip } from './flip.js';
import { getEdges } from './getEdges.js';
import { isClockwise } from './isClockwise.js';
import { isClosed } from './isClosed.js';
import { isCounterClockwise } from './isCounterClockwise.js';
import { measureArea } from './measureArea.js';
import { open } from './open.js';
import { toGeneric } from './toGeneric.js';
import { toPolygon } from './toPolygon.js';
import { toSegments } from './toSegments.js';
import { toZ0Polygon } from './toZ0Polygon.js';
import { transform } from './transform.js';

const isOpen = (path) => !isClosed(path);

export {
  assertGood,
  assertUnique,
  canonicalize,
  close,
  concatenate,
  deduplicate,
  flip,
  getEdges,
  isClockwise,
  isClosed,
  isCounterClockwise,
  isOpen,
  measureArea,
  open,
  toGeneric,
  toPolygon,
  toSegments,
  toZ0Polygon,
  transform,
};

export const translate = (vector, path) =>
  transform(fromTranslation(vector), path);
export const rotateX = (radians, path) =>
  transform(fromXRotation(radians), path);
export const rotateY = (radians, path) =>
  transform(fromYRotation(radians), path);
export const rotateZ = (radians, path) =>
  transform(fromZRotation(radians), path);
export const scale = (vector, path) => transform(fromScaling(vector), path);
