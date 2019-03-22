import { pathsToPdf } from '@jsxcad/algorithm-pdf';
import { writeFileSync } from '@jsxcad/sys';

export const writePdf = ({ path }, shape) => {
  const paths = shape.toPaths({});
  writeFileSync(path, paths, { translator: () => pathsToPdf({}, paths) });
};
