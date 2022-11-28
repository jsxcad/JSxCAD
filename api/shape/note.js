import { computeHash, emit } from '@jsxcad/sys';

import Shape from './Shape.js';

export const Note = (md) => {
  if (Array.isArray(md)) {
    md = md.join(', ');
  }
  emit({ md, hash: computeHash(md) });
};

export const note = Shape.registerMethod('note', (md) => (shape) => {
  Note(md);
  return shape;
});

export default note;
