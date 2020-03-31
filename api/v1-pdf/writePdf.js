import { addPending, emit, writeFile } from '@jsxcad/sys';
import { getLeafs, getPlans, toKeptGeometry } from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { toPdf as convertToPdf } from '@jsxcad/convert-pdf';
import { ensurePages } from '@jsxcad/api-v1-plans';

export const downloadPdf = (shape, name, { lineWidth = 0.096 } = {}) => {
  // CHECK: Should this be limited to Page plans?
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const { size } = entry.plan.page;
    for (let leaf of getLeafs(entry.content)) {
      const op = convertToPdf(leaf, { lineWidth, size });
      addPending(op);
      entries.push({ data: op, filename: `${name}_${++index}.pdf`, type: 'application/pdf' });
    }
  }
  emit({ download: { entries } });
  return shape;
};

const downloadPdfMethod = function (...args) { return downloadPdf(this, ...args); };
Shape.prototype.downloadPdf = downloadPdfMethod;

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
