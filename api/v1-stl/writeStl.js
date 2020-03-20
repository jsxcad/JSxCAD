import { Shape, log } from '@jsxcad/api-v1-shape';
import { getLeafs, getPlans, toKeptGeometry } from '@jsxcad/geometry-tagged';

import { toStl as convertToStl } from '@jsxcad/convert-stl';
import { writeFile } from '@jsxcad/sys';

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
    await writeFile({}, `output/${name}_${index}.stl`, stl);
    await writeFile({}, `geometry/${name}_${index}.stl`, JSON.stringify(toKeptGeometry(leaf)));
  }
  const end = new Date();
  log(`writeStl end: ${end - start}`, 'serious');
};

const method = function (...args) { return writeStl(this, ...args); };
Shape.prototype.writeStl = method;

export default writeStl;
