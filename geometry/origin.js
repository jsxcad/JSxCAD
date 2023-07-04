import { Point } from './Point.js';
import { getInverseMatrices } from './tagged/getInverseMatrices.js';
import { transform } from './transform.js';

export const origin = (geometry) => {
  const { local } = getInverseMatrices(geometry);
  return transform(Point(), local);
};
