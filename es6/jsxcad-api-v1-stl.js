import Shape, { Shape as Shape$1 } from './jsxcad-api-v1-shape.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { readFile, addPending, writeFile, getPendingErrorHandler, emit } from './jsxcad-sys.js';
import { ensurePages } from './jsxcad-api-v1-layout.js';

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

const readStl = async (path, { src, format = 'ascii' } = {}) => {
  let data = await readFile({ doSerialize: false }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ sources: [src] }, `cache/${path}`);
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

const prepareStl = (shape, name, options = {}) => {
  // CHECK: Should this be limited to Page plans?
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toStl(entry, options).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.stl`,
      type: 'application/sla',
    });
  }
  return entries;
};

const downloadStlMethod = function (...args) {
  const entries = prepareStl(this, ...args);
  emit({ download: { entries } });
  return this;
};
Shape$1.prototype.downloadStl = downloadStlMethod;

const writeStl = (shape, name, options = {}) => {
  for (const { data, filename } of prepareStl(shape, name, {})) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const method = function (...args) {
  return writeStl(this, ...args);
};
Shape$1.prototype.writeStl = method;

const api = {
  readStl,
  writeStl,
};

export default api;
export { readStl, writeStl };
