import { emitNote, note as op } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Note = emitNote;

export const note = Shape.registerMethod3(
  'note',
  ['inputGeometry', 'string'],
  op
);

export default note;
