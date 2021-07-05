import { Shape } from '@jsxcad/api-shape';
import { fromShapefile } from '@jsxcad/convert-shapefile';
import { read } from '@jsxcad/sys';

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

export const readShapefile = async (shpPath, dbfPath) => {
  let shpData = await read(`source/${shpPath}`, { doSerialize: false });
  if (shpData === undefined) {
    shpData = await read(`cache/${shpPath}`, { sources: [shpPath] });
  }
  let dbfData = await read(`source/${dbfPath}`, { doSerialize: false });
  if (dbfData === undefined) {
    dbfData = await read(`cache/${dbfPath}`, { sources: [dbfPath] });
  }
  return Shape.fromGeometry(await fromShapefile(shpData, dbfData));
};

export default readShapefile;
