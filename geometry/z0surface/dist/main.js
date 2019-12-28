import { canonicalize as canonicalize$1, transform as transform$1 } from './jsxcad-math-poly3.js';
import { fromZRotation, fromScaling, fromTranslation } from './jsxcad-math-mat4.js';
import { cache } from './jsxcad-cache.js';
export { makeConvex } from './jsxcad-geometry-z0surface-boolean.js';

const canonicalize = (surface) => surface.map(canonicalize$1);

// Transforms
const transform = (matrix, surface) => surface.map(polygon => transform$1(matrix, polygon));
const rotateZ = (angle, surface) => transform(fromZRotation(angle), surface);
const scale = (vector, surface) => transform(fromScaling(vector), surface);
const translate = (vector, surface) => transform(fromTranslation(vector), surface);

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (surface) => {
  if (surface.measureBoundingBox === undefined) {
    let max = [-Infinity, -Infinity, 0];
    let min = [Infinity, Infinity, 0];
    for (const polygon of surface) {
      for (const point of polygon) {
        if (point[0] < min[0]) min[0] = point[0];
        if (point[1] < min[1]) min[1] = point[1];
        if (point[0] > max[0]) max[0] = point[0];
        if (point[1] > max[1]) max[1] = point[1];
      }
    }
    surface.measureBoundingBox = [min, max];
  }
  return surface.measureBoundingBox;
};

const iota = 1e-5;
const X = 0;
const Y = 1;

// Tolerates overlap up to one iota.
const doesNotOverlap = (a, b) => {
  if (a.length === 0 || b.length === 0) {
    return true;
  }
  const [minA, maxA] = measureBoundingBox(a);
  const [minB, maxB] = measureBoundingBox(b);
  if (maxA[X] <= minB[X] + iota) { return true; }
  if (maxA[Y] <= minB[Y] + iota) { return true; }
  if (maxB[X] <= minA[X] + iota) { return true; }
  if (maxB[Y] <= minA[Y] + iota) { return true; }
  return false;
};

// move to tagged

const fromPathImpl = (path) => [path];

const fromPath = cache(fromPathImpl);

export { canonicalize, doesNotOverlap, fromPath, measureBoundingBox, rotateZ, scale, transform, translate };
