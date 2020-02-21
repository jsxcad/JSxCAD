import Shape from '@jsxcad/api-v1-shape';
import { fromStl } from '@jsxcad/convert-stl';
import { readFile } from '@jsxcad/sys';

/**
 *
 * # Read STL
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * await readStl({ path: 'stl/teapot.stl',
 *                 format: 'ascii',
 *                 sources: [{ file: 'stl/teapot.stl' },
 *                           { url: 'https://jsxcad.js.org/stl/teapot.stl' }] })
 * ```
 * :::
 *
 **/

const formatToAs = (format) => {
  switch (format) {
    case 'binary': return 'bytes';
    case 'ascii':
    default: return 'utf8';
  }
};

export const readStl = async (path, { src, format = 'ascii' } = {}) => {
  const as = formatToAs(format);
  let data = await readFile({ as }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ as, sources: [src] }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromStl(data, { format }));
};

export default readStl;
