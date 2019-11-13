import { getSources, readFile } from '@jsxcad/sys';

import { fromPng } from '@jsxcad/convert-png';

/**
 *
 * # Read PNG
 *
 **/

export const readPng = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const data = await readFile({ as: 'bytes', sources: getSources(`file/${path}`), ...options }, `file/${path}`);
  const raster = await fromPng({}, data);
  return raster;
};
