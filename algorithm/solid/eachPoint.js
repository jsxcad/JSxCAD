import { eachPoint as eachPointOfSurface } from '@jsxcad/algorithm-surface';

export const eachPoint = (options = {}, thunk, solid) => {
  for (const surface of solid) {
    eachPointOfSurface(options, thunk, surface);
  }
};
