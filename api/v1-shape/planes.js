import {
  fromPlane as fromPlaneToSurface,
  toPlane as toPlaneFromSurface,
} from '@jsxcad/geometry-surface';
import {
  getAnyNonVoidSurfaces,
  getNonVoidSolids,
  taggedSurface,
} from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

export const planes = (shape) => {
  const pieces = [];
  for (const { solid, tags } of getNonVoidSolids(shape.toDisjointGeometry())) {
    for (const surface of solid) {
      pieces.push(
        Shape.fromGeometry(
          taggedSurface(
            { tags },
            fromPlaneToSurface(toPlaneFromSurface(surface))
          )
        )
      );
    }
  }
  for (const { surface, z0Surface, tags } of getAnyNonVoidSurfaces(
    shape.toDisjointGeometry()
  )) {
    const thisSurface = surface || z0Surface;
    pieces.push(
      Shape.fromGeometry(
        taggedSurface(
          { tags },
          fromPlaneToSurface(toPlaneFromSurface(thisSurface))
        )
      )
    );
  }

  return pieces;
};

const planesMethod = function () {
  return planes(this);
};
Shape.prototype.planes = planesMethod;

export default planes;
