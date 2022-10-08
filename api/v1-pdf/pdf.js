import { Shape, ensurePages } from '@jsxcad/api-shape';
import { addPending, emit, generateUniqueId, getPendingErrorHandler, getSourceLocation, write } from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toPdf } from '@jsxcad/convert-pdf';

export const preparePdf = (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const pdfPath = `download/pdf/${path}/${generateUniqueId()}`;
    const render = async () => {
      await write(pdfPath, toPdf(entry, options).catch(getPendingErrorHandler()));
    };
    addPending(render());
    const filename = `${name}_${index++}.pdf`;
    const record = {
      path: pdfPath,
      filename,
      type: 'application/pdf',
    };
    records.push(record);
    const shape = Shape.fromGeometry(entry);
    const hash =
      hashSum({ filename, options }) + hashGeometry(shape.toGeometry());
    shape.gridView(filename, options.view);
    emit({ download: { entries: [record] }, hash });
  }
  return records;
};

const pdf =
  (...args) =>
  (shape) => {
    const { value: name, func: op, object: options } = Shape.destructure(args);
    preparePdf(shape, name, op, options);
    return shape;
  };

Shape.registerMethod('pdf', pdf);
