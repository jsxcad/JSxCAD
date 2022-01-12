import { hash as hashObject } from '@jsxcad/sys';

export const hash = (geometry) => {
  if (geometry.hash === undefined) {
    geometry.hash = hashObject(geometry);
  }
  return geometry.hash;
};
