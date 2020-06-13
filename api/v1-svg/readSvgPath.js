import { getSources, readFile } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
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
  let data = await readFile({ decode: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile(
      { decode: 'utf8', sources: getSources(`cache/${path}`), ...options },
      `cache/${path}`
    );
  }
  return Shape.fromGeometry(await fromSvgPath(options, data));
};

export default readSvgPath;
