import hashSum from 'hash-sum';

export const hash = (geometry) => {
  if (geometry.hash === undefined) {
    geometry.hash = hashSum(geometry);
  }
  return geometry.hash;
};
