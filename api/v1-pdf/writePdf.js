import Shape from '@jsxcad/api-v1-shape';
import { toPdf as convertToPdf } from '@jsxcad/convert-pdf';
import { writeFile } from '@jsxcad/sys';

export const toPdf = async (shape, path, { lineWidth = 0.096, size = [210, 297] } = {}) =>
  convertToPdf({ lineWidth, size }, shape.toKeptGeometry());

export const writePdf = async (shape, path, { lineWidth = 0.096, size = [210, 297] } = {}) => {
  const pdf = await toPdf(shape, path, { lineWidth, size });
  await writeFile({}, `output/${path}`, pdf);
  await writeFile({}, `geometry/${path}`, JSON.stringify(shape.toKeptGeometry()));
};

const toPdfMethod = function (...args) { return toPdf(this, ...args); };
Shape.prototype.toPdf = toPdfMethod;

const writePdfMethod = function (...args) { return writePdf(this, ...args); };
Shape.prototype.writePdf = writePdfMethod;
