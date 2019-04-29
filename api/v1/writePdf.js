import { toPdf } from '@jsxcad/convert-pdf';
import { writeFileSync } from '@jsxcad/sys';

export const writePdf = ({ path }, shape) => {
  const geometry = shape.toDisjointGeometry();
  writeFileSync(path, () => toPdf({}, geometry), geometry);
};
