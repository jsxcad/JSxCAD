import { Shape } from './Shape';
import { fromSvg } from '@jsxcad/convert-svg';
import { readFile } from '@jsxcad/sys';

/**
 *
 * # Read Scalable Vector Format
 *
 * ::: illustration { "view": { "position": [0, 0, 100] } }
 * ```
 *
 * const svg = readSvg({ path: 'svg/butterfly.svg',
 *                       sources: [{ file: 'svg/butterfly.svg' },
 *                                 { url: 'https://jsxcad.js.org/svg/butterfly.svg' }] });
 * svg.center().scale(0.02)
 * ```
 * :::
 *
 **/

export const readSvg = async (options) => {
  const { path } = options;
  return Shape.fromGeometry(await fromSvg(options, await readFile({ decode: 'utf8', ...options }, path)));
};
