import { computeHash, emit, generateUniqueId } from '@jsxcad/sys';

import Shape from './Shape.js';
import { md } from './md.js';

export const table = Shape.registerMethod2(
  'table',
  ['input', 'number', 'number', 'strings'],
  async (input, rows, columns, cells) => {
    const uniqueId = generateUniqueId;
    const open = { open: { type: 'table', rows, columns, uniqueId } };
    emit({ open, hash: computeHash(open) });
    for (let cell of cells) {
      if (cell instanceof Function) {
        cell = cell(input);
      }
      if (typeof cell === 'string') {
        md(cell);
      }
    }
    const close = { close: { type: 'table', rows, columns, uniqueId } };
    emit({ close, hash: computeHash(close) });
    return input;
  }
);
