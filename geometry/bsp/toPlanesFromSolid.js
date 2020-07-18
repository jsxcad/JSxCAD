import { equals as equalsPlane } from '@jsxcad/math-plane';
import { toPlane as toPlaneFromSurface } from '@jsxcad/geometry-surface';

export const toPlanesFromSolid = (solid, offset = 0) => {
  const planes = [];
  const addPlane = (plane) => {
    // FIX: Inefficient.
    if (!planes.some((entry) => equalsPlane(entry, plane))) {
      planes.push(plane);
    }
  };

  for (const surface of solid) {
    addPlane(toPlaneFromSurface(surface));
  }

  return planes;
};
