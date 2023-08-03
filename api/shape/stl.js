import {
  computeHash,
  emit,
  generateUniqueId,
  getSourceLocation,
  read,
  write,
} from '@jsxcad/sys';
import { ensurePages, hash as hashGeometry } from '@jsxcad/geometry';
import { fromStl, toStl } from '@jsxcad/convert-stl';

import Shape from './Shape.js';
import { view } from './view.js';

export const LoadStl = Shape.registerMethod3(
  'LoadStl',
  ['string', 'modes:binary,ascii,wrap', 'options'],
  async (
    path,
    { binary, ascii, wrap },
    {
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      cornerThreshold = 20 / 360,
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
      wrapAlways: wrap,
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      cornerThreshold,
    });
  }
);

export const Stl = Shape.registerMethod3(
  'Stl',
  ['string', 'modes:wrap', 'options'],
  async (
    text,
    { wrap },
    {
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      cornerThreshold = 20 / 360,
    } = {}
  ) =>
    fromStl(new TextEncoder('utf8').encode(text), {
      format: 'ascii',
      wrapAlways: wrap,
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      cornerThreshold,
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
      const hash = computeHash({ filename, options }) + hashGeometry(entry);
      await view(name, options.view)(Shape.fromGeometry(entry));
      emit({ download: { entries: [record] }, hash });
    }
    return geometry;
  }
);
