import { ensurePages, toDisplayGeometry } from '@jsxcad/geometry';
import { getSourceLocation, write } from '@jsxcad/sys';
import { gridView, qualifyViewId } from './view.js';

import Shape from './Shape.js';
import { toPdf } from '@jsxcad/convert-pdf';

export const pdf = Shape.registerMethod3(
  'pdf',
  ['inputGeometry', 'string', 'function', 'options'],
  async (
    geometry,
    name,
    op = (_v) => (s) => s,
    { lineWidth = 0.096, size = [210, 297], definitions } = {}
  ) => {
    const options = { lineWidth, size, definitions };
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const displayGeometry = toDisplayGeometry(
      await Shape.applyToGeometry(geometry, op)
    );
    for (const entry of ensurePages(displayGeometry)) {
      const pdfPath = `download/pdf/${path}/${id}/${viewId}`;
      await write(pdfPath, await toPdf(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.pdf`;
      const record = {
        path: pdfPath,
        filename,
        type: 'application/pdf',
      };
      await gridView(name, {
        ...options.view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);
