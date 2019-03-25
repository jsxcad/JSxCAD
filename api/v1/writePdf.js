import { pathsToPdf } from '@jsxcad/algorithm-pdf';
import { writeFileSync } from '@jsxcad/sys';

export const writePdf = ({ path }, ...shapes) => {
  const pathSets = shapes.map(shape => shape.toPaths({}));
  writeFileSync(path, pathSets, { translator: () => pathsToPdf({}, [].concat(...pathSets)) });
};
