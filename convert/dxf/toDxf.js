import {
  getNonVoidPaths,
  getPathEdges,
  toKeptGeometry,
} from '@jsxcad/geometry';

import Drawing from 'dxf-writer';

export const toDxf = async (geometry, options = {}) => {
  const drawing = new Drawing();
  const keptGeometry = toKeptGeometry(await geometry);
  for (const { paths } of getNonVoidPaths(keptGeometry)) {
    for (const path of paths) {
      for (const [[x1, y1], [x2, y2]] of getPathEdges(path)) {
        drawing.drawLine(x1, y1, x2, y2);
      }
    }
  }
  return drawing.toDxfString();
};

export default toDxf;
