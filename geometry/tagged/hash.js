import { computeHash } from '@jsxcad/sys';

export const hash = (geometry) => {
  if (geometry.hash === undefined) {
    geometry.hash = computeHash(geometry);
  }
  return geometry.hash;
};
