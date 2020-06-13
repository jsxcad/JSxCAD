import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from '@jsxcad/api-v1-shape';
import { fromDst } from '@jsxcad/convert-dst';

/**
 *
 * # Read Data Stitch Tajima
 *
 * ::: illustration { "view": { "position": [0, 0, 200] } }
 * ```
 * await readDst({ path: 'dst/atg-sft003.dst',
 *               sources: [{ file: 'dst/atg-sft003.dst' },
 *                         { url: 'https://jsxcad.js.org/dst/atg-sft003.dst' }] })
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 20] } }
 * ```
 * await readDst({ path: 'dst/atg-sft003.dst',
 *                 sources: [{ file: 'dst/atg-sft003.dst' },
 *                           { url: 'https://jsxcad.js.org/dst/atg-sft003.dst' }] })
 * ```
 * :::
 *
 **/

export const readDst = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ as: 'bytes' }, `source/${path}`);
  if (data === undefined) {
    data = await readFile(
      { doSerialize: false, sources: getSources(`cache/${path}`), ...options },
      `cache/${path}`
    );
  }
  return Shape.fromGeometry(await fromDst(options, data));
};

export default readDst;
