import Shape from './jsxcad-api-v1-shape.js';
import { fromStl, toStl as toStl$1 } from './jsxcad-convert-stl.js';
import { readFile, writeFile } from './jsxcad-sys.js';
import { toKeptGeometry, getPlans, getLeafs } from './jsxcad-geometry-tagged.js';

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

const readStl = async (path, { src, format = 'ascii' } = {}) => {
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

const toStl = async (shape, options = {}) => {
  const pages = [];
  // CHECK: Should this be limited to Page plans?
  const geometry = shape.toKeptGeometry();
  for (const entry of getPlans(geometry)) {
    if (entry.plan.page) {
      for (let leaf of getLeafs(entry.content)) {
        const stl = await toStl$1(leaf, {});
        pages.push({ stl, leaf: { ...entry, content: leaf }, index: pages.length });
      }
    }
  }
  return pages;
};

const writeStl = async (shape, name, options = {}) => {
  for (const { stl, leaf, index } of await toStl(shape, {})) {
    await writeFile({}, `output/${name}_${index}.stl`, stl);
    await writeFile({}, `geometry/${name}_${index}.stl`, JSON.stringify(toKeptGeometry(leaf)));
  }
};

const method = function (...args) { return writeStl(this, ...args); };
Shape.prototype.writeStl = method;

const api = {
  readStl,
  writeStl
};

export default api;
export { readStl, writeStl };
