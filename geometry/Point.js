import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { taggedPoints } from './tagged/taggedPoints.js';
import { transformCoordinate } from './transform.js';

export const Point = (x = 0, y = 0, z = 0, coordinate) =>
  taggedPoints({}, [coordinate || [x, y, z]]);

export const OrientedPoint = (
  x = 0,
  y = 0,
  z = 0,
  nx = 0,
  ny = 0,
  nz = 1,
  coordinate
) => {
  if (coordinate) {
    [x = 0, y = 0, z = 0, nx = 0, ny = 0, nz = 1] = coordinate;
  }
  // Disorient the point as though the source of a segment.
  const inverse = fromSegmentToInverseTransform(
    [
      [x, y, z],
      [x + nx, y + ny, z + nz],
    ],
    [0, 0, 1]
  );
  const basePoint = transformCoordinate([x, y, z], inverse);
  const matrix = invertTransform(inverse);
  return taggedPoints({ matrix }, [basePoint]);
};

export const Points = (coordinates) => taggedPoints({}, coordinates);
