import { pathsToPdf } from '@jsxcad/algorithm-pdf';
import { writeFileSync } from '@jsxcad/sys';

export const writePdf = ({ path }, ...shapes) => {
  const pathSets = shapes.map(shape => {
    if (shape instanceof Array) {
      return shape;
    } else {
      return shape.toPolygons({});
    }
  });
  writeFileSync(path, pathSets, { translator: () => pathsToPdf({}, [].concat(...pathSets)) });
};
