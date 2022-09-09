import { computeHash, emit } from '@jsxcad/sys';

import Shape from './Shape.js';

export const note = Shape.chainable((md) => (shape) => {
  if (Array.isArray(md)) {
    md = md.join(', ');
  }
  emit({ md, hash: computeHash(md) });
  return shape;
});

Shape.registerMethod('note', note);

export default note;
