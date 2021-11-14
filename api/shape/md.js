import Shape from './Shape.js';
import { emit } from '@jsxcad/sys';
import hashSum from 'hash-sum';

export const md = (strings, ...placeholders) => {
  const md = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ md, hash: hashSum(md) });
  return md;
};

const mdMethod =
  (...chunks) =>
  (shape) => {
    const strings = [];
    for (const chunk of chunks) {
      if (chunk instanceof Function) {
        strings.push(chunk(shape));
      } else {
        strings.push(chunk);
      }
    }
    const md = strings.join('');
    emit({ md, hash: hashSum(md) });
    return shape;
  };

Shape.registerMethod('md', mdMethod);
