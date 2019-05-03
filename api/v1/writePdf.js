import { toPdf } from '@jsxcad/convert-pdf';
import { writeFileSync } from '@jsxcad/sys';

export const writePdf = (options, shape) => {
  const { path } = options;
  const geometry = shape.toDisjointGeometry();
  writeFileSync(path, () => toPdf(options, geometry), geometry);
};
