import {
  outline as outlineSurface,
  toPlane as toPlaneFromSurface,
} from "@jsxcad/geometry-surface";

export const outline = (solid, normalize) => {
  const polygons = [];
  for (const surface of solid) {
    const plane = toPlaneFromSurface(surface);
    for (const polygon of outlineSurface(surface)) {
      polygon.plane = plane;
      polygons.push(polygon);
    }
  }
  return polygons;
};
