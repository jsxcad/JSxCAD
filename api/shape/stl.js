import {
  computeHash,
  emit,
  generateUniqueId,
  getSourceLocation,
  read,
  write,
} from '@jsxcad/sys';
import { fromStl, toStl } from '@jsxcad/convert-stl';

import Shape from './Shape.js';
import { ensurePages } from './Page.js';
import { hash as hashGeometry } from '@jsxcad/geometry';
import { view } from './view.js';

export const LoadStl = Shape.registerMethod2(
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
    let format = 'binary';
    if (ascii) {
      format = 'ascii';
    } else if (binary) {
      format = 'binary';
    }
    return Shape.fromGeometry(
      await fromStl(data, {
        format,
        wrapAlways: wrap,
        wrapAbsoluteAlpha,
        wrapAbsoluteOffset,
        wrapRelativeAlpha,
        wrapRelativeOffset,
        cornerThreshold,
      })
    );
  }
);

export const Stl = Shape.registerMethod2(
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
  ) => {
    return Shape.fromGeometry(
      await fromStl(new TextEncoder('utf8').encode(text), {
        format: 'ascii',
        wrapAlways: wrap,
        wrapAbsoluteAlpha,
        wrapAbsoluteOffset,
        wrapRelativeAlpha,
        wrapRelativeOffset,
        cornerThreshold,
      })
    );
  }
);

export const stl = Shape.registerMethod2(
  'stl',
  ['input', 'string', 'function', 'options'],
  async (input, name, op = (s) => s, options = {}) => {
    const { path } = getSourceLocation();
    let index = 0;
    for (const entry of await ensurePages(await op(Shape.chain(input)))) {
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
    return input;
  }
);
