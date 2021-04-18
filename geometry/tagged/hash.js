import { nanoid } from 'nanoid/non-secure';

export const hash = (geometry) => {
  if (geometry.hash === undefined) {
    geometry.hash = nanoid();
    console.log(`QQ/hash/new: ${geometry.hash}`);
  } else {
    console.log(`QQ/hash/old: ${geometry.hash}`);
  }
  return geometry.hash;
};
