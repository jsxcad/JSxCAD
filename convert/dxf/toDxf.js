import { getNonVoidPaths, toKeptGeometry } from '@jsxcad/geometry-tagged';

import Drawing from 'dxf-writer';
import { getEdges } from '@jsxcad/geometry-path';

export const toDxf = async (geometry, options = {}) => {
  const drawing = new Drawing();
  const keptGeometry = toKeptGeometry(await geometry);
  for (const { paths } of getNonVoidPaths(keptGeometry)) {
    for (const path of paths) {
      for (const [[x1, y1], [x2, y2]] of getEdges(path)) {
        drawing.drawLine(x1, y1, x2, y2);
      }
    }
  }
  return drawing.toDxfString();
};

export default toDxf;
