import { eachPoint as eachPointOfSurface } from "@jsxcad/geometry-surface";

export const eachPoint = (thunk, solid) => {
  for (const surface of solid) {
    eachPointOfSurface(thunk, surface);
  }
};
