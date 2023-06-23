import { computeHash, emit } from '@jsxcad/sys';

import Shape from './Shape.js';

export const emitNote = (md) =>
  emit({ md, hash: computeHash(md) });

export const Note = emitNote;

const noteImpl = (geometry, md) => {
  emitNote(md);
  return geometry;
};

export const note = Shape.registerMethod3(
  'note',
  ['inputGeometry', 'string'],
  noteImpl,
);

export default note;
