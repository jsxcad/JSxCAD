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
    modes,
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
    if (modes.includes('ascii')) {
      format = 'ascii';
    }
    console.log(`QQ/api/stl/LoadStl/cornerThreshold: ${cornerThreshold}`);
    return Shape.fromGeometry(
      await fromStl(data, {
        format,
        wrapAlways: modes.includes('wrap'),
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
  ['string', 'modes:binary,ascii,wrap', 'options'],
  async (
    text,
    modes,
    {
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      cornerThreshold = 20/360,
    } = {}
  ) => {
    return Shape.fromGeometry(
      await fromStl(new TextEncoder('utf8').encode(text), {
        format: 'ascii',
        wrapAlways: modes.includes('wrap'),
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
