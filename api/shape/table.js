import { computeHash, emit, generateUniqueId } from '@jsxcad/sys';

import Shape from './Shape.js';
import { md } from './md.js';

export const table = Shape.registerMethod(
  'table',
  (rows, columns, ...cells) =>
    (shape) => {
      const uniqueId = generateUniqueId;
      const open = { open: { type: 'table', rows, columns, uniqueId } };
      emit({ open, hash: computeHash(open) });
      for (let cell of cells) {
        if (cell instanceof Function) {
          cell = cell(shape);
        }
        if (typeof cell === 'string') {
          md(cell);
        }
      }
      const close = { close: { type: 'table', rows, columns, uniqueId } };
      emit({ close, hash: computeHash(close) });
      return shape;
    }
);
