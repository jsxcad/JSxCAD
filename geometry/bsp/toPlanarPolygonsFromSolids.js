import { equals as equalsPlane } from '@jsxcad/math-plane';
import { toPlane as toPlaneFromSurface } from '@jsxcad/geometry-surface';
import toPolygonsFromPlanes from './toPolygonsFromPlanes.js';

export const toPlanarPolygonsFromSolids = (solids) => {
  const planes = [];
  const addPlane = (plane) => {
    // FIX: Inefficient.
    if (!planes.some((entry) => equalsPlane(entry, plane))) {
      planes.push(plane);
    }
  };

  for (const solid of solids) {
    for (const surface of solid) {
      addPlane(toPlaneFromSurface(surface));
    }
  }

  return toPolygonsFromPlanes(planes);
};

export default toPlanarPolygonsFromSolids;
