import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { fromShapefile } from '@jsxcad/convert-shapefile';

/**
 *
 * # Read Shapefile
 *
 * ::: illustration { "view": { "position": [0, 0, 100] } }
 * ```
 *
 * await readShapefile({ shpPath: 'ne_50m_admin_0_countries.shp', dbfPath: 'ne_50m_admin_0_countries.dbf' });
 * ```
 * :::
 *
 **/

export const readShapefile = async (options) => {
  const { shpPath, dbfPath } = options;
  const shpData = await readFile({ as: 'bytes', sources: getSources(shpPath), ...options }, `file/${shpPath}`);
  const dbfData = await readFile({ as: 'bytes', sources: getSources(dbfPath), ...options }, `file/${dbfPath}`);
  return Shape.fromGeometry(await fromShapefile(options, shpData, dbfData));
};
