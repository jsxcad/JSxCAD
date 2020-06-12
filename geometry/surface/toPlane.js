import { toPlane as toPlaneOfPolygon } from "@jsxcad/math-poly3";

// FIX: This is incorrect, since it assumes the first non-degenerate polygon is representative.

export const toPlane = (surface) => {
  if (surface.plane !== undefined) {
    return surface.plane;
  } else {
    for (const polygon of surface) {
      const plane = toPlaneOfPolygon(polygon);
      if (plane !== undefined) {
        surface.plane = plane;
        return surface.plane;
      }
    }
  }
};
