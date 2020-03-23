import { getLeafs, getPlans, toKeptGeometry } from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { toPdf as convertToPdf } from '@jsxcad/convert-pdf';
import { writeFile } from '@jsxcad/sys';

// FIX: Support multi-page pdf, and multi-page preview.

export const toPdf = async (shape, { lineWidth = 0.096 } = {}) => {
  const pages = [];
  // CHECK: Should this be limited to Page plans?
  const geometry = shape.toKeptGeometry();
  for (const entry of getPlans(geometry)) {
    if (entry.plan.page) {
      const { size } = entry.plan.page;
      for (let leaf of getLeafs(entry.content)) {
        const pdf = await convertToPdf(leaf, { lineWidth, size });
        pages.push({ pdf, leaf: { ...entry, content: leaf }, index: pages.length });
      }
    }
  }
  return pages;
};

export const writePdf = async (shape, name, { lineWidth = 0.096 } = {}) => {
  for (const { pdf, leaf, index } of await toPdf(shape, { lineWidth })) {
    await writeFile({ doSerialize: false }, `output/${name}_${index}.pdf`, pdf);
    await writeFile({}, `geometry/${name}_${index}.pdf`, toKeptGeometry(leaf));
  }
};

const writePdfMethod = function (...args) { return writePdf(this, ...args); };
Shape.prototype.writePdf = writePdfMethod;
