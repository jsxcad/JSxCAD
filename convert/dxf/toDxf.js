import {
  disjoint,
  getNonVoidSegments,
  section,
  transformCoordinate,
} from '@jsxcad/geometry';

import Drawing from 'dxf-writer';

const X = 0;
const Y = 1;

export const toDxf = async (baseGeometry, options = {}) => {
  const drawing = new Drawing();
  const sectioned = section(await baseGeometry, [{ type: 'points', tags: [] }]);
  const geometry = disjoint([sectioned]);
  for (const { matrix, segments } of getNonVoidSegments(geometry)) {
    for (let [start, end] of segments) {
      start = transformCoordinate(matrix, start);
      end = transformCoordinate(matrix, end);
      drawing.drawLine(start[X], start[Y], end[X], end[Y]);
    }
  }
  return drawing.toDxfString();
};

export default toDxf;
