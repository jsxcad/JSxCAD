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

export const readStl = async (options) => {
  const { path } = options;
  return Shape.fromGeometry(await fromStl(options, await readFile(options, path)));
};
