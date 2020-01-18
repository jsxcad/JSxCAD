import Shape from './jsxcad-api-v1-shape.js';
import { toPdf as toPdf$1 } from './jsxcad-convert-pdf.js';
import { writeFile } from './jsxcad-sys.js';

const toPdf = async (shape, path, { lineWidth = 0.096, size = [210, 297] } = {}) =>
  toPdf$1({ lineWidth, size }, shape.toKeptGeometry());

const writePdf = async (shape, path, { lineWidth = 0.096, size = [210, 297] } = {}) => {
  const pdf = await toPdf(shape, path, { lineWidth, size });
  await writeFile({}, `output/${path}`, pdf);
  await writeFile({}, `geometry/${path}`, JSON.stringify(shape.toKeptGeometry()));
};

const toPdfMethod = function (...args) { return toPdf(this); };
Shape.prototype.toPdf = toPdfMethod;

const writePdfMethod = function (...args) { return writePdf(this, ...args); };
Shape.prototype.writePdf = writePdfMethod;

const api = { toPdf, writePdf };

export default api;
export { toPdf, writePdf };
