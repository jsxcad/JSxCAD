import { computeHash } from '@jsxcad/sys';
import { prepareForSerialization } from './prepareForSerialization.js';

export const hash = (geometry) => {
  if (geometry.hash === undefined) {
    if (geometry.content) {
      for (const content of geometry.content) {
        hash(content);
      }
    }
    prepareForSerialization(geometry);
    geometry.hash = computeHash(geometry);
  }
  return geometry.hash;
};
