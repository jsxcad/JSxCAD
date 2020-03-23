import { getLeafs, getPlans, toKeptGeometry } from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { toSvg as convertToSvg } from '@jsxcad/convert-svg';
import { writeFile } from '@jsxcad/sys';

export const toSvg = async (shape, options = {}) => {
  const pages = [];
  // CHECK: Should this be limited to Page plans?
  const geometry = shape.toKeptGeometry();
  for (const entry of getPlans(geometry)) {
    if (entry.plan.page) {
      for (let leaf of getLeafs(entry.content)) {
        const svg = await convertToSvg(leaf);
        pages.push({ svg, leaf: { ...entry, content: leaf }, index: pages.length });
      }
    }
  }
  return pages;
};

export const writeSvg = async (shape, name, options = {}) => {
  for (const { svg, leaf, index } of await toSvg(shape, options)) {
    await writeFile({ doSerialize: false }, `output/${name}_${index}.svg`, svg);
    await writeFile({}, `geometry/${name}_${index}.svg`, toKeptGeometry(leaf));
  }
};

const method = function (...args) { return writeSvg(this, ...args); };
Shape.prototype.writeSvg = method;

export default writeSvg;
