import { getSolids, getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { toPlane } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { withConnector } from './faceConnector';

const Z = 2;

export const flat = (shape) => {
  let bestDepth = Infinity;
  let bestSurface;

  const assay = (surface) => {
    const plane = toPlane(surface);
    if (plane !== undefined) {
      const [to] = toXYPlaneTransforms(plane);
      const flatShape = shape.transform(to);
      const [min, max] = flatShape.measureBoundingBox();
      const depth = max[Z] - min[Z];
      if (depth < bestDepth) {
        bestDepth = depth;
        bestSurface = surface;
      }
    }
  };

  const geometry = shape.toKeptGeometry();
  for (const { solid } of getSolids(geometry)) {
    for (const surface of solid) {
      assay(surface);
    }
  }
  for (const { surface } of getSurfaces(geometry)) {
    assay(surface);
  }
  for (const { z0Surface } of getZ0Surfaces(geometry)) {
    assay(z0Surface);
  }

  return withConnector(shape, bestSurface, 'flat');
};

const flatMethod = function () { return flat(this); };
Shape.prototype.flat = flatMethod;

flat.signature = 'flat(shape:Shape) -> Connector';
flatMethod.signature = 'Shape -> flat() -> Connector';
