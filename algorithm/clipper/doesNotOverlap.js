import { measureBoundingBox } from './measureBoundingBox.js';

const iota = 1e-5;
const X = 0;
const Y = 1;

// Tolerates overlap up to one iota.
// Ths means that abutting surfaces may remain distinct.
export const doesNotOverlap = (a, b) => {
  if (a.length === 0 || b.length === 0) {
    return true;
  }
  const [minA, maxA] = measureBoundingBox(a);
  const [minB, maxB] = measureBoundingBox(b);
  if (maxA[X] <= minB[X] + iota) {
    return true;
  }
  if (maxA[Y] <= minB[Y] + iota) {
    return true;
  }
  if (maxB[X] <= minA[X] + iota) {
    return true;
  }
  if (maxB[Y] <= minA[Y] + iota) {
    return true;
  }
  return false;
};

// No overlap tolerance.
export const doesNotOverlapOrAbut = (a, b) => {
  if (a.length === 0 || b.length === 0) {
    return true;
  }
  const [minA, maxA] = measureBoundingBox(a);
  const [minB, maxB] = measureBoundingBox(b);
  if (maxA[X] < minB[X] - iota) {
    return true;
  }
  if (maxA[Y] < minB[Y] - iota) {
    return true;
  }
  if (maxB[X] < minA[X] - iota) {
    return true;
  }
  if (maxB[Y] < minA[Y] - iota) {
    return true;
  }
  return false;
};
