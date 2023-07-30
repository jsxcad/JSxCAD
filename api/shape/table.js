import { computeHash, emit, generateUniqueId } from '@jsxcad/sys';

import Shape from './Shape.js';
import { emitNote } from '@jsxcad/geometry';

export const table = Shape.registerMethod3(
  'table',
  ['inputGeometry', 'number', 'number', 'strings'],
  async (geometry, rows, columns, cells) => {
    const uniqueId = generateUniqueId;
    const open = { open: { type: 'table', rows, columns, uniqueId } };
    emit({ open, hash: computeHash(open) });
    for (let cell of cells) {
      emitNote(cell);
    }
    const close = { close: { type: 'table', rows, columns, uniqueId } };
    emit({ close, hash: computeHash(close) });
    return geometry;
  }
);
