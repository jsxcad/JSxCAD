import { inset } from './inset.js';

export const offset = (outlineGraph, amount) => {
  if (amount >= 0) {
    return outlineGraph;
  } else {
    return inset(outlineGraph, 0 - amount, 0, 0);
  }
};
