import { readFile, getSources } from './jsxcad-sys.js';
import Shape from './jsxcad-api-v1-shape.js';
import { fromShapefile } from './jsxcad-convert-shapefile.js';

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

const readShapefile = async (options) => {
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

const api = { readShapefile };

export default api;
export { readShapefile };
