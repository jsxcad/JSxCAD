import { nanoid } from 'nanoid/non-secure';

export const hash = (geometry) => {
  if (geometry.hash === undefined) {
    geometry.hash = nanoid();
  }
  return geometry.hash;
};
