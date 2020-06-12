import { makeConvexNoHoles as makeConvexSurfaceNoHoles } from "@jsxcad/geometry-surface";

export const makeConvexNoHoles = (solid) => {
  const convexSolid = [];
  for (const surface of solid) {
    convexSolid.push(makeConvexSurfaceNoHoles(surface));
  }
  return convexSolid;
};
