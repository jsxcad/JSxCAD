import { getSources, readFile } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
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
  let shpData = await readFile({ doSerialize: false, ...options }, `source/${shpPath}`);
  if (shpData === undefined) {
    shpData = await readFile({ sources: getSources(`cache/${shpPath}`), ...options }, `cache/${shpPath}`);
  }
  let dbfData = await readFile({ doSerialize: false, ...options }, `source/${dbfPath}`);
  if (dbfData === undefined) {
    dbfData = await readFile({ sources: getSources(`cache/${dbfPath}`), ...options }, `cache/${dbfPath}`);
  }
  return Shape.fromGeometry(await fromShapefile(options, shpData, dbfData));
};

export default readShapefile;
