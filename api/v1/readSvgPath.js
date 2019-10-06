import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { fromSvgPath } from '@jsxcad/convert-svg';

/**
 *
 * # Read SVG path data
 *
 **/

export const readSvgPath = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const data = await readFile({ decode: 'utf8', sources: getSources(path), ...options }, `file/${path}`);
  return Shape.fromGeometry(await fromSvgPath(options, data));
};
