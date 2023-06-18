import { computeHash, emit } from '@jsxcad/sys';

import Shape from './Shape.js';

export const Note = (md) => {
  if (Array.isArray(md)) {
    md = md.join(', ');
  }
  emit({ md, hash: computeHash(md) });
};

export const note = Shape.registerMethod2(
  ['note', 'md'],
  ['input', 'string'],
  (input, md) => {
    Note(md);
    return input;
  }
);

export default note;
