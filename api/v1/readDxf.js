import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { fromDxf } from '@jsxcad/convert-dxf';

export const readDxf = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const sources = getSources(`file/${path}`);
  const data = await readFile({ as: 'utf8', sources, ...options },
                              `file/${path}`);
  return Shape.fromGeometry(await fromDxf(options, data));
};
