import { computeHash, emit } from '@jsxcad/sys';

import Shape from './Shape.js';

export const md = (strings, ...placeholders) => {
  const md = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ md, hash: computeHash(md) });
  return md;
};

const mdMethod = Shape.chainable((...chunks) => (shape) => {
  const strings = [];
  for (const chunk of chunks) {
    if (chunk instanceof Function) {
      strings.push(chunk(shape));
    } else {
      strings.push(chunk);
    }
  }
  const md = strings.join('');
  emit({ md, hash: computeHash(md) });
  return shape;
});

Shape.registerMethod('md', mdMethod);
