import Shape, { log, Shape as Shape$1 } from './jsxcad-api-v1-shape.js';
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
  const start = new Date();
  log(`writeStl start: ${start}`, 'serious');
  for (const { stl, leaf, index } of await toStl(shape, {})) {
    await writeFile({ doSerialize: false }, `output/${name}_${index}.stl`, stl);
    await writeFile({}, `geometry/${name}_${index}.stl`, toKeptGeometry(leaf));
  }
  const end = new Date();
  log(`writeStl end: ${end - start}`, 'serious');
};

const method = function (...args) { return writeStl(this, ...args); };
Shape$1.prototype.writeStl = method;

const api = {
  readStl,
  writeStl
};

export default api;
export { readStl, writeStl };
