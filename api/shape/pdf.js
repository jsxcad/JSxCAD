import { computeHash, emit, getSourceLocation, write } from '@jsxcad/sys';
import { gridView, qualifyViewId } from './view.js';

import Shape from './Shape.js';
import { ensurePages } from './Page.js';

import { hash as hashGeometry } from '@jsxcad/geometry';
import { toPdf } from '@jsxcad/convert-pdf';

export const pdf = Shape.registerMethod('pdf', (...args) => async (shape) => {
  const {
    value: name,
    func: op = (s) => s,
    object: options = {},
  } = Shape.destructure(args);
  const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
  let index = 0;
  for (const entry of await ensurePages(await op(shape))) {
    const pdfPath = `download/pdf/${path}/${id}/${viewId}`;
    await write(pdfPath, await toPdf(entry, options));
    const suffix = index++ === 0 ? '' : `_${index}`;
    const filename = `${name}${suffix}.pdf`;
    const record = {
      path: pdfPath,
      filename,
      type: 'application/pdf',
    };
    const hash = computeHash({ filename, options }) + hashGeometry(entry);
    await gridView(name, options.view)(Shape.fromGeometry(entry));
    emit({ download: { entries: [record] }, hash });
  }
  return shape;
});
