import { Shape, ensurePages } from '@jsxcad/api-shape';
import { addPending, emit, getPendingErrorHandler } from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toPdf } from '@jsxcad/convert-pdf';

export const preparePdf = (shape, name, op = (s) => s, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const op = toPdf(entry, options).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.pdf`,
      type: 'application/pdf',
    });
    Shape.fromGeometry(entry).gridView(name, options.view);
  }
  return entries;
};

const pdf =
  (...args) =>
  (shape) => {
    const { value: name, func: op, object: options } = Shape.destructure(args);
    const entries = preparePdf(shape, name, op, options);
    const download = { entries };
    const hash = hashSum({ name, options }) + hashGeometry(shape.toGeometry());
    emit({ download, hash });
    return shape;
  };

Shape.registerMethod('pdf', pdf);
