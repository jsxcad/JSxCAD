import { toPdf } from '@jsxcad/convert-pdf';
import { writeFile } from '@jsxcad/sys';

export const writePdf = async (options, shape) => {
  const { path } = options;
  const geometry = shape.toDisjointGeometry();
  return writeFile({ geometry }, path, toPdf(options, geometry));
};
