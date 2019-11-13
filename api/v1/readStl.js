import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { fromStl } from '@jsxcad/convert-stl';

/**
 *
 * # Read STL
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * await readStl({ path: 'stl/teapot.stl',
 *                 format: 'ascii',
 *                 sources: [{ file: 'stl/teapot.stl' },
 *                           { url: 'https://jsxcad.js.org/stl/teapot.stl' }] })
 * ```
 * :::
 *
 **/

const formatToAs = (format) => {
  switch (format) {
    case 'binary': return 'bytes';
    case 'ascii':
    default: return 'utf8';
  }
};

export const readStl = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path, format = 'ascii' } = options;
  const as = formatToAs(format);
  return Shape.fromGeometry(await fromStl(options, await readFile({ as, sources: getSources(`file/${path}`), ...options }, `file/${path}`)));
};
