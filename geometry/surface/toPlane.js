import { toPlane as toPlaneOfPolygon } from '@jsxcad/math-poly3';

// FIX

export const toPlane = (surface) => {
  if (surface.plane !== undefined) {
    return surface.plane;
  } else {
    for (const polygon of surface) {
      const plane = toPlaneOfPolygon(polygon);
      if (!isNaN(plane[0])) {
        surface.plane = plane;
        return surface.plane;
      }
    }
    throw Error('die');
  }
};
