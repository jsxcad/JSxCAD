import { outline as outlineSurface } from "@jsxcad/geometry-surface";

export const toOutlinedSolid = (solid, normalize) => {
  const outlines = [];
  for (const surface of solid) {
    outlines.push(outlineSurface(surface, normalize));
  }
  return outlines;
};
