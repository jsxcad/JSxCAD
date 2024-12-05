import {
  disjoint,
  isNotTypeGhost,
  linearize,
  section,
  toApproximateMatrix,
  transformCoordinate,
} from '@jsxcad/geometry';

import Drawing from 'dxf-writer';

export const toDxf = async (baseGeometry, options = {}) => {
  const drawing = new Drawing();
  const sectioned = section(await baseGeometry, [{ type: 'points', tags: [] }]);
  const geometry = disjoint(sectioned, {});
  for (const { matrix, segments } of linearize(
    geometry,
    (geometry) => geometry.type === 'segments' && isNotTypeGhost(geometry)
  )) {
    const approximateMatrix = toApproximateMatrix(matrix)[1];
    for (let [start, end] of segments) {
      const [startX, startY] = transformCoordinate(start, approximateMatrix);
      const [endX, endY] = transformCoordinate(end, approximateMatrix);
      drawing.drawLine(startX, startY, endX, endY);
    }
  }
  return drawing.toDxfString();
};

export default toDxf;
