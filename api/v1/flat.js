import { getSolids, getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';
import { measureBoundingBox, transform as transformSolid, translate as translateSolid } from '@jsxcad/geometry-solid';
import { toPlane, transform as transformSurface } from '@jsxcad/geometry-surface';

import Shape from './Shape';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

const Z = 2;

export const flat = (shape) => {
  const assembly = [];

  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    let bestDepth = Infinity;
    let bestFlatSolid;
    for (const surface of solid) {
      const [to] = toXYPlaneTransforms(toPlane(surface));
      const flatSolid = transformSolid(to, solid);
      const [min, max] = measureBoundingBox(flatSolid);
      const depth = max[Z] - min[Z];
      if (depth < bestDepth) {
        bestDepth = depth;
        bestFlatSolid = translateSolid([0, 0, -min[Z]], flatSolid);
      }
    }
    if (bestFlatSolid) {
      assembly.push({ solid: bestFlatSolid, tags });
    }
  }
  for (const { surface, tags } of getSurfaces(shape.toKeptGeometry())) {
    const [to] = toXYPlaneTransforms(toPlane(surface));
    assembly.push({ z0Surface: transformSurface(to, surface), tags });
  }
  for (const geometry of getZ0Surfaces(shape.toKeptGeometry())) {
    assembly.push(geometry);
  }

  return Shape.fromGeometry({ assembly });
};

const method = function () { return flat(this); };
Shape.prototype.flat = method;
