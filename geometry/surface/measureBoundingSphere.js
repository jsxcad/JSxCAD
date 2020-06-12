import { add, distance, scale } from "@jsxcad/math-vec3";

import { measureBoundingBox } from "./measureBoundingBox";

export const measureBoundingSphere = (surface) => {
  if (surface.measureBoundingSphere === undefined) {
    const box = measureBoundingBox(surface);
    const center = scale(0.5, add(box[0], box[1]));
    const radius = distance(center, box[1]);
    surface.measureBoundingSphere = [center, radius];
  }
  return surface.measureBoundingSphere;
};
