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
  let data = await readFile({ as: 'bytes', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'bytes', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  const raster = await fromPng({}, data);
  return raster;
};
