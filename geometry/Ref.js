import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { rotateX, rotateY, rotateZ } from './rotate.js';

import { Point } from './Point.js';
import { as } from './tag.js';
import { hasTypeReference } from './tagged/type.js';
import { transform } from './transform.js';

export const Ref = (
  name,
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
  const matrix = invertTransform(inverse);
  const point = Point(0, 0, 0);
  const content = name ? as(point, [name]) : point;
  return hasTypeReference(transform(content, matrix));
};

export const ref = (geometry, name) => transform(Ref(name), geometry.matrix);

export const X = (x = 0) => Ref(undefined, x, 0, 0, 0, 0, 1);
export const Y = (y = 0) => Ref(undefined, 0, y, 0, 0, 0, 1);
export const Z = (z = 0) => Ref(undefined, 0, 0, z, 0, 0, 1);
export const XY = (z = 0) => Ref(undefined, 0, 0, z, 0, 0, 1);
export const YX = (z = 0) => Ref(undefined, 0, 0, z, 0, 0, -1);
export const XZ = (y = 0) => Ref(undefined, 0, y, 0, 0, 1, 0);
export const ZX = (y = 0) => Ref(undefined, 0, y, 0, 0, -1, 0);
export const YZ = (x = 0) => Ref(undefined, x, 0, 0, 1, 0, 0);
export const ZY = (x = 0) => Ref(undefined, x, 0, 0, -1, 0, 0);

export const RX = (t = 0) => rotateX(Ref(undefined, 0, 0, 0, 0, 0, 1), t);
export const RY = (t = 0) => rotateY(Ref(undefined, 0, 0, 0, 0, 0, 1), t);
export const RZ = (t = 0) => rotateZ(Ref(undefined, 0, 0, 0, 0, 0, 1), t);
