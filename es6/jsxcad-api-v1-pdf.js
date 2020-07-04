import { writeFile, addPending, emit } from './jsxcad-sys.js';
import Shape from './jsxcad-api-v1-shape.js';
import { toPdf } from './jsxcad-convert-pdf.js';
import { ensurePages } from './jsxcad-api-v1-layout.js';

const preparePdf = (shape, name, { lineWidth = 0.096 } = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const { size } = entry.layout;
    const op = toPdf(entry, { lineWidth, size });
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

const writePdf = async (shape, name, { lineWidth = 0.096 } = {}) => {
  for (const { data, filename } of preparePdf(shape, name, { lineWidth })) {
    await writeFile({ doSerialize: false }, `output/${filename}`, data);
  }
};

const writePdfMethod = function (...args) {
  return writePdf(this, ...args);
};
Shape.prototype.writePdf = writePdfMethod;

const api = { writePdf };

export default api;
export { writePdf };
