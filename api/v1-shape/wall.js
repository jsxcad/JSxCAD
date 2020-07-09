import {
  getAnyNonVoidSurfaces,
  taggedAssembly,
  taggedSolid,
} from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSurface } from '@jsxcad/geometry-solid';

// FIX: Debugging only -- remove this method.
export const wall = (shape) => {
  const normalize = createNormalize3();
  const solids = [];
  for (const { surface, z0Surface, tags } of getAnyNonVoidSurfaces(
    shape.toDisjointGeometry()
  )) {
    solids.push(
      taggedSolid({ tags }, fromSurface(surface || z0Surface, normalize))
    );
  }
  return Shape.fromGeometry(taggedAssembly({}, ...solids));
};

const wallMethod = function () {
  return wall(this);
};
Shape.prototype.wall = wallMethod;
