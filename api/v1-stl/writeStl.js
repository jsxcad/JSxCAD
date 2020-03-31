import { Shape, log } from '@jsxcad/api-v1-shape';
import { addPending, emit, writeFile } from '@jsxcad/sys';
import { getLeafs, getPlans, toKeptGeometry } from '@jsxcad/geometry-tagged';

import { toStl as convertToStl } from '@jsxcad/convert-stl';
import { ensurePages } from '@jsxcad/api-v1-plans';

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

export const downloadStl = (shape, name, options = {}) => {
  // CHECK: Should this be limited to Page plans?
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    for (let leaf of getLeafs(entry.content)) {
      const op = convertToStl(leaf, options);
      addPending(op);
      entries.push({ data: op, filename: `${name}_${++index}.stl`, type: 'application/sla' });
    }
  }
  emit({ download: { entries } });
  return shape;
};

const downloadStlMethod = function (...args) { return downloadStl(this, ...args); };
Shape.prototype.downloadStl = downloadStlMethod;

export const toStl = async (shape, options = {}) => {
  const pages = [];
  // CHECK: Should this be limited to Page plans?
  const geometry = shape.toKeptGeometry();
  for (const entry of getPlans(geometry)) {
    if (entry.plan.page) {
      for (let leaf of getLeafs(entry.content)) {
        const stl = await convertToStl(leaf, {});
        pages.push({ stl, leaf: { ...entry, content: leaf }, index: pages.length });
      }
    }
  }
  return pages;
};

export const writeStl = async (shape, name, options = {}) => {
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
Shape.prototype.writeStl = method;

export default writeStl;
