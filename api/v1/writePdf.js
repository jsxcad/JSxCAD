import { Shape } from './Shape';
import { toPdf } from '@jsxcad/convert-pdf';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write PDF
 *
 * ```
 * cube().section().writePdf('cube.pdf');
 * ```
 *
 * ```
 * writePdf({ path: 'cube.pdf' }, cube().section());
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
  return writeFile({ geometry, preview: true }, path, pdf);
};

const method = function (options = {}) { return writePdf(options, this); };

Shape.prototype.writePdf = method;
