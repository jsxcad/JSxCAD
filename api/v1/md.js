import Shape from '@jsxcad/api-v2';
import { emit } from '@jsxcad/sys';
import hashSum from 'hash-sum';

export const md = (strings, ...placeholders) => {
  const md = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ md, hash: hashSum(md) });
  return md;
};

const mdMethod = function (string, ...placeholders) {
  if (string instanceof Function) {
    string = string(this);
  }
  md([string], ...placeholders);
  return this;
};

Shape.prototype.md = mdMethod;
