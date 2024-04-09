import { getInverseMatrices } from './tagged/getInverseMatrices.js';
import { transform } from './transform.js';

export const base = (geometry) => {
  const { local } = getInverseMatrices(geometry);
  return transform(geometry, local);
};
