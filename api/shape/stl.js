import { fromStl, toStl } from '@jsxcad/convert-stl';
import { generateUniqueId, getSourceLocation, read, write } from '@jsxcad/sys';

import Shape from './Shape.js';
import { ensurePages } from '@jsxcad/geometry';
import { view } from './view.js';

export const LoadStl = Shape.registerMethod3(
  'LoadStl',
  [
    'string',
    'modes:binary,ascii',
    'strings:wrap,patch,auto',
    'number',
    'options',
  ],
  async (
    path,
    { binary, ascii },
    strategies,
    implicitFaceCountLimit = 0,
    {
      faceCountLimit = implicitFaceCountLimit,
      sharpEdgeThreshold = 120 / 360,
    } = {}
  ) => {
    const data = await read(`source/${path}`, { sources: [path] });
    if (data === undefined) {
      throw Error(`LoadStl cannot read: "${path}"`);
    }
    let format = 'binary';
    if (ascii) {
      format = 'ascii';
    } else if (binary) {
      format = 'binary';
    }
    return fromStl(data, {
      format,
      faceCountLimit,
      sharpEdgeThreshold,
      strategies,
    });
  }
);

export const Stl = Shape.registerMethod3(
  'Stl',
  ['string', 'strings:wrap,patch,auto', 'number', 'options'],
  async (
    text,
    strategies,
    implicitFaceCountLimit = 0,
    {
      faceCountLimit = implicitFaceCountLimit,
      sharpEdgeThreshold = 120 / 360,
    } = {}
  ) =>
    fromStl(new TextEncoder('utf8').encode(text), {
      format: 'ascii',
      faceCountLimit,
      sharpEdgeThreshold,
      strategies,
    })
);

export const stl = Shape.registerMethod3(
  'stl',
  ['inputGeometry', 'string', 'function', 'options'],
  async (geometry, name, op = (_v) => (s) => s, options = {}) => {
    const { path } = getSourceLocation();
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const stlPath = `download/stl/${path}/${generateUniqueId()}`;
      await write(stlPath, await toStl(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.stl`;
      const record = {
        path: stlPath,
        filename,
        type: 'application/sla',
      };
      // Produce a view of what will be downloaded.
      await view(name, { ...options.view, download: { entries: [record] } })(
        Shape.fromGeometry(entry)
      );
    }
    return geometry;
  }
);
