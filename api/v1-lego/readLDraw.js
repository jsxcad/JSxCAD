import Shape from '@jsxcad/api-v1-shape';
import { fromLDraw } from '@jsxcad/convert-ldraw';
import { getSources } from '@jsxcad/sys';

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
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  return Shape.fromGeometry(await fromLDraw({ sources: getSources(`cache/${path}`), ...options }));
};
