import { getSolids, getSurfaces } from '@jsxcad/geometry-tagged';

import Shape from './Shape';
import { toPlane } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

const Z = 2;

export const flat = (shape) => {
  let bestDepth = Infinity;
  let bestFlatShape = shape;

  const assay = (plane) => {
    if (plane !== undefined) {
      const [to] = toXYPlaneTransforms(plane);
      const flatShape = shape.transform(to);
      const [min, max] = flatShape.measureBoundingBox();
      const depth = max[Z] - min[Z];
      if (depth < bestDepth) {
        bestDepth = depth;
        bestFlatShape = flatShape.moveZ(-min[Z]);
      }
    } else {
      console.log(`QQ/bad`);
    }
  };

  const geometry = shape.toKeptGeometry();
  for (const { solid } of getSolids(geometry)) {
    for (const surface of solid) {
      assay(toPlane(surface));
    }
  }
  for (const { surface } of getSurfaces(geometry)) {
    assay(toPlane(surface));
  }
  // We do not need to consider z0Surface, since it could never improve the
  // orientation.

  return bestFlatShape;
};

const flatMethod = function () { return flat(this); };
Shape.prototype.flat = flatMethod;

flat.signature = 'flat(shape:Shape) -> Shape';
flatMethod.signature = 'Shape -> flat() -> Shape';
