import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { rotateX, rotateY, rotateZ } from './rotate.js';
import { transform, transformCoordinate } from './transform.js';

import { hasTypeReference } from './tagged/type.js';
import { taggedPoints } from './tagged/taggedPoints.js';

export const Ref = (
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
  return hasTypeReference(taggedPoints({ matrix }, [basePoint]));
};

export const ref = (
  geometry,
  x = 0,
  y = 0,
  z = 0,
  nx = 0,
  ny = 0,
  nz = 1,
  coordinate
) =>
  transform(
    Ref((x = 0), (y = 0), (z = 0), (nx = 0), (ny = 0), (nz = 1), coordinate),
    transform(geometry.matrix)
  );

export const X = (x = 0) => Ref(x, 0, 0, 0, 0, 1);
export const Y = (y = 0) => Ref(0, y, 0, 0, 0, 1);
export const Z = (z = 0) => Ref(0, 0, z, 0, 0, 1);
export const XY = (z = 0) => Ref(0, 0, z, 0, 0, 1);
export const YX = (z = 0) => Ref(0, 0, z, 0, 0, -1);
export const XZ = (y = 0) => Ref(0, y, 0, 0, 1, 0);
export const ZX = (y = 0) => Ref(0, y, 0, 0, -1, 0);
export const YZ = (x = 0) => Ref(x, 0, 0, 1, 0, 0);
export const ZY = (x = 0) => Ref(x, 0, 0, -1, 0, 0);

export const RX = (t = 0) => rotateX(Ref(0, 0, 0, 0, 0, 1), t);
export const RY = (t = 0) => rotateY(Ref(0, 0, 0, 0, 0, 1), t);
export const RZ = (t = 0) => rotateZ(Ref(0, 0, 0, 0, 0, 1), t);
