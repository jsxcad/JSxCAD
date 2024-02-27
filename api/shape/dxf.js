import { fromDxf, toDxf } from '@jsxcad/convert-dxf';
import { getSourceLocation, read, write } from '@jsxcad/sys';
import { gridView, qualifyViewId } from './view.js';

import { Shape } from './Shape.js';
import { ensurePages } from '@jsxcad/geometry';

export const LoadDxf = Shape.registerMethod3(
  'LoadDxf',
  ['string', 'options'],
  async (path) => {
    let data = await read(`source/${path}`, { doSerialize: false });
    if (data === undefined) {
      data = await read(`cache/${path}`, { sources: [path] });
    }
    return fromDxf(data);
  }
);

export const dxf = Shape.registerMethod3(
  'dxf',
  ['inputGeometry', 'string', 'function', 'options'],
  async (geometry, name, op = (_v) => (s) => s, options = {}) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const dxfPath = `download/dxf/${path}/${id}/${viewId}`;
      await write(dxfPath, await toDxf(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const record = {
        path: dxfPath,
        filename: `${name}${suffix}.dxf`,
        type: 'application/dxf',
      };
      await gridView(name, {
        ...options.view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);
