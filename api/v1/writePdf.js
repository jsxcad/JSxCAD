import { pathsToPdf } from '@jsxcad/convert-pdf';
import { writeFileSync } from '@jsxcad/sys';

export const writePdf = ({ path }, ...shapes) => {
  const surfaces = shapes.map(shape => {
    if (shape instanceof Array) {
      return shape;
    } else {
      return shape.toZ0Surface({});
    }
  });

  const drawings = shapes.map(shape => {
    if (shape instanceof Array) {
      return shape;
    } else {
      return shape.toZ0Drawing({});
    }
  });

  // FIX: How is this going to work with visualization?
  // Do we need to partition the geometries in the files by kind?
  writeFileSync(path,
                () => pathsToPdf({}, [].concat(...surfaces, ...drawings)),
                { drawings: [].concat(surfaces, drawings) });
};
