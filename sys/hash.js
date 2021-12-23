import hashSum from 'hash-sum';

export const hash = (item) => hashSum(item);

export const computeHash = hash;

export const fromStringToIntegerHash = (s) =>
  Math.abs(
    s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  );
