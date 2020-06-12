import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from "@jsxcad/math-mat4";

import { assertGood } from "./assertGood";
import { assertUnique } from "./assertUnique";
import { canonicalize } from "./canonicalize";
import { close } from "./close";
import { concatenate } from "./concatenate";
import { deduplicate } from "./deduplicate";
import { flip } from "./flip";
import { getEdges } from "./getEdges";
import { isClockwise } from "./isClockwise";
import { isClosed } from "./isClosed";
import { isCounterClockwise } from "./isCounterClockwise";
import { measureArea } from "./measureArea";
import { open } from "./open";
import { toGeneric } from "./toGeneric";
import { toPolygon } from "./toPolygon";
import { toSegments } from "./toSegments";
import { toZ0Polygon } from "./toZ0Polygon";
import { transform } from "./transform";

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
