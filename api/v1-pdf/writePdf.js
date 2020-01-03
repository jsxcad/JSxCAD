import Shape from '@jsxcad/api-v1-shape';
import { toPdf } from '@jsxcad/convert-pdf';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write PDF
 *
 * ```
 * Cube().section().writePdf('cube.pdf');
 * ```
 *
 **/

export const writePdf = async (options, shape) => {
  if (typeof options === 'string') {
    // Support writePdf('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const pdf = await toPdf({ preview: true, ...options }, geometry);
  await writeFile({}, `output/${path}`, pdf);
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (options = {}) { return writePdf(options, this); };
Shape.prototype.writePdf = method;

export default writePdf;
