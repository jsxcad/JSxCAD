import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { fromSvg } from '@jsxcad/convert-svg';

/**
 *
 * # Read Scalable Vector Format
 *
 * ::: illustration { "view": { "position": [0, 0, 100] } }
 * ```
 *
 * const svg = await readSvg({ path: 'svg/butterfly.svg',
 *                             sources: [{ file: 'svg/butterfly.svg' },
 *                                       { url: 'https://jsxcad.js.org/svg/butterfly.svg' }] });
 * svg.center().scale(0.02)
 * ```
 * :::
 *
 **/

export const readSvg = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ decode: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ decode: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromSvg(options, data));
};
