import { Shape } from './Shape';
import { fromLDraw } from '@jsxcad/convert-ldraw';

/**
 *
 * # Read LDraw Parts
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * await readLDraw({ part: '3004.dat' })
 * ```
 * :::
 *
 **/

export const readLDraw = async (options) => {
  return Shape.fromGeometry(await fromLDraw(options));
};
