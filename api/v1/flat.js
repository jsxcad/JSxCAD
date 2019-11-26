import { getSolids, getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';

import Shape from './Shape';
import { toPlane } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

const Z = 2;

export const flat = (shape) => {
  let bestDepth = Infinity;
  let bestFlatShape = shape;

  const assay = (plane) => {
    const [to] = toXYPlaneTransforms(plane);
    const flatShape = shape.transform(to);
    const [min, max] = flatShape.measureBoundingBox();
    const depth = max[Z] - min[Z];
    if (depth < bestDepth) {
      bestDepth = depth;
      bestFlatShape = flatShape.moveZ(-min[Z]);
    }
  };

  const geometry = shape.toKeptGeometry();
  for (const { solid } of getSolids(geometry)) {
    for (const surface of solid) {
      assay(toPlane(surface));
    }
  }
  for (const { surface } of getSurfaces(shape.toKeptGeometry())) {
    assay(toPlane(surface));
  }
  for (const { z0Surface } of getZ0Surfaces(shape.toKeptGeometry())) {
    assay(toPlane(z0Surface));
  }

  return bestFlatShape;
};

const method = function () { return flat(this); };
Shape.prototype.flat = method;
