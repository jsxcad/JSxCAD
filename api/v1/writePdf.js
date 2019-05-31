import { Shape } from './Shape';
import { toPdf } from '@jsxcad/convert-pdf';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write PDF
 *
 * ```
 * cube().crossSection().writePdf({ path: 'cube.pdf' });
 * ```
 *
 * ```
 * writePdf({ path: 'cube.pdf' }, cube().crossSection());
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
  return writeFile({ geometry, preview: true }, path, toPdf({ preview: true, ...options }, geometry));
};

const method = function (options = {}) { writePdf(options, this); return this; };

Shape.prototype.writePdf = method;
