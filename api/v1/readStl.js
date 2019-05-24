import { Shape } from './Shape';
import { fromStl } from '@jsxcad/convert-stl';
import { readFile } from '@jsxcad/sys';

/**
 *
 * # Read STL
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * readStl({ path: 'stl/teapot.stl',
 *           format: 'ascii',
 *           sources: [{ file: 'stl/teapot.stl' },
 *                     { url: 'https://jsxcad.js.org/stl/teapot.stl' }] })
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
  const { path, format = 'ascii' } = options;
  const as = formatToAs(format);
  return Shape.fromGeometry(await fromStl(options, await readFile({ as, ...options }, path)));
};
