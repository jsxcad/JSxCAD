import Shape, { Shape as Shape$1 } from './jsxcad-api-v1-shape.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { readFile, writeFile, addPending, emit } from './jsxcad-sys.js';
import { getLeafs } from './jsxcad-geometry-tagged.js';
import { ensurePages } from './jsxcad-api-v1-plans.js';

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

const downloadStl = (shape, name, options = {}) => {
  // CHECK: Should this be limited to Page plans?
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    for (let leaf of getLeafs(entry.content)) {
      const op = toStl(leaf, options);
      addPending(op);
      entries.push({ data: op, filename: `${name}_${++index}.stl`, type: 'application/sla' });
    }
  }
  emit({ download: { entries } });
  return shape;
};

const downloadStlMethod = function (...args) { return downloadStl(this, ...args); };
Shape$1.prototype.downloadStl = downloadStlMethod;

const writeStl = async (shape, name, options = {}) => {
  let index = 0;
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    for (let leaf of getLeafs(entry.content)) {
      const stl = await toStl(leaf, options);
      await writeFile({ doSerialize: false }, `output/${name}_${index}.stl`, stl);
    }
  }
};

const method = function (...args) { return writeStl(this, ...args); };
Shape$1.prototype.writeStl = method;

const api = {
  readStl,
  writeStl
};

export default api;
export { readStl, writeStl };
