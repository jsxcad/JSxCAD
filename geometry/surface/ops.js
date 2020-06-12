import {
  canonicalize as canonicalizePolygon,
  transform as transformPolygon,
} from "@jsxcad/math-poly3";
import { fromScaling, fromTranslation, fromZRotation } from "@jsxcad/math-mat4";

// export const toPlane = (surface) => toPlaneOfPolygon(surface[0]);
export const canonicalize = (surface) => surface.map(canonicalizePolygon);

// Transforms
export const transform = (matrix, surface) =>
  surface.map((polygon) => transformPolygon(matrix, polygon));
export const translate = (vector, surface) =>
  transform(fromTranslation(vector), surface);
export const rotateZ = (angle, surface) =>
  transform(fromZRotation(angle), surface);
export const scale = (vector, surface) =>
  transform(fromScaling(vector), surface);
