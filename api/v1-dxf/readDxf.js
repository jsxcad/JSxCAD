import { getSources, readFile } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { fromDxf } from '@jsxcad/convert-dxf';

export const readDxf = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ as: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromDxf(options, data));
};

export default readDxf;
