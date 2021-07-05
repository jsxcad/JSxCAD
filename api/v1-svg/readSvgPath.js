import { Shape } from '@jsxcad/api-shape';
import { fromSvgPath } from '@jsxcad/convert-svg';
import { read } from '@jsxcad/sys';

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
  let data = await read(`source/${path}`);
  if (data === undefined) {
    data = await read(`cache/${path}`, { sources: [path] });
  }
  return Shape.fromGeometry(await fromSvgPath(options, data));
};

export default readSvgPath;
