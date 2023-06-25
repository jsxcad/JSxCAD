import { computeHash, emit } from '@jsxcad/sys';

export const emitNote = (md) => emit({ md, hash: computeHash(md) });

export const Note = emitNote;

export const note = (geometry, md) => {
  if (typeof md !== 'string') {
    throw Error(`note expects a string`);
  }
  emitNote(md);
  return geometry;
};
