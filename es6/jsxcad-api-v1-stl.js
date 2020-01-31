import Shape from './jsxcad-api-v1-shape.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { readFile, writeFile } from './jsxcad-sys.js';

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

const readStl = async (path, { src, format = 'ascii' }) => {
  const as = formatToAs(format);
  let data = await readFile({ as }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ as, sources: [src] }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromStl(data, { format }));
};

/**
 *
 * # Write STL
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeStl('cube.stl');
 * await readStl({ path: 'cube.stl' });
 * ```
 * :::
 *
 **/

const writeStl = async (shape, path, options = {}) => {
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toStl(geometry, options));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (...args) { return writeStl(this, ...args); };
Shape.prototype.writeStl = method;

const api = {
  readStl,
  writeStl
};

export default api;
export { readStl, writeStl };
