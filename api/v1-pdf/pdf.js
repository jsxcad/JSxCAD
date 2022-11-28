import { Shape, ensurePages } from '@jsxcad/api-shape';
import {
  emit,
  generateUniqueId,
  getSourceLocation,
  write,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toPdf } from '@jsxcad/convert-pdf';

export const preparePdf = async (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  for (const entry of await ensurePages(await op(shape))) {
    const pdfPath = `download/pdf/${path}/${generateUniqueId()}`;
    await write(
      pdfPath,
      await toPdf(entry, options)
    );
    const filename = `${name}_${index++}.pdf`;
    const record = {
      path: pdfPath,
      filename,
      type: 'application/pdf',
    };
    records.push(record);
    const hash =
      hashSum({ filename, options }) + hashGeometry(entry);
    await Shape.fromGeometry(entry).gridView(filename, options.view);
    emit({ download: { entries: [record] }, hash });
  }
  return records;
};

const pdf = Shape.registerMethod('pdf',
  (...args) =>
  async (shape) => {
    const { value: name, func: op, object: options } = Shape.destructure(args);
    await preparePdf(shape, name, op, options);
    return shape;
  });
