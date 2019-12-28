import { eachPoint as eachPointOfSurface } from '@jsxcad/geometry-surface';

export const eachPoint = (options = {}, thunk, solid) => {
  for (const surface of solid) {
    eachPointOfSurface(thunk, surface);
  }
};
