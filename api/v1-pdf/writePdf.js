import { addPending, emit, writeFile } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { toPdf as convertToPdf } from '@jsxcad/convert-pdf';
import { ensurePages } from '@jsxcad/api-v1-layout';

export const preparePdf = (shape, name, { lineWidth = 0.096 } = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const { size } = entry.layout;
    const op = convertToPdf(entry, { lineWidth, size });
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.pdf`,
      type: 'application/pdf',
    });
  }
  return entries;
};

const downloadPdfMethod = function (...args) {
  emit({ download: { entries: preparePdf(this, ...args) } });
  return this;
};
Shape.prototype.downloadPdf = downloadPdfMethod;
Shape.prototype.pdf = downloadPdfMethod;

export const writePdf = async (shape, name, { lineWidth = 0.096 } = {}) => {
  for (const { data, filename } of preparePdf(shape, name, { lineWidth })) {
    await writeFile({ doSerialize: false }, `output/${filename}`, data);
  }
};

const writePdfMethod = function (...args) {
  return writePdf(this, ...args);
};
Shape.prototype.writePdf = writePdfMethod;
