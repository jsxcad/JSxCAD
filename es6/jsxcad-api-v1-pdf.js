import { getPlans, getLeafs, toKeptGeometry } from './jsxcad-geometry-tagged.js';
import Shape from './jsxcad-api-v1-shape.js';
import { toPdf as toPdf$1 } from './jsxcad-convert-pdf.js';
import { writeFile } from './jsxcad-sys.js';

// FIX: Support multi-page pdf, and multi-page preview.

const toPdf = async (shape, { lineWidth = 0.096 } = {}) => {
  const pages = [];
  // CHECK: Should this be limited to Page plans?
  const geometry = shape.toKeptGeometry();
  for (const entry of getPlans(geometry)) {
    if (entry.plan.page) {
      const { size } = entry.plan.page;
      for (let leaf of getLeafs(entry.content)) {
        const pdf = await toPdf$1(leaf, { lineWidth, size });
        pages.push({ pdf, leaf: { ...entry, content: leaf }, index: pages.length });
      }
    }
  }
  return pages;
};

const writePdf = async (shape, name, { lineWidth = 0.096 } = {}) => {
  for (const { pdf, leaf, index } of await toPdf(shape, { lineWidth })) {
    await writeFile({}, `output/${name}_${index}.pdf`, pdf);
    await writeFile({}, `geometry/${name}_${index}.pdf`, JSON.stringify(toKeptGeometry(leaf)));
  }
};

const writePdfMethod = function (...args) { return writePdf(this, ...args); };
Shape.prototype.writePdf = writePdfMethod;

const api = { toPdf, writePdf };

export default api;
export { toPdf, writePdf };
