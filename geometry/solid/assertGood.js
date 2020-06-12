import { assertGood as assertGoodSurface } from "@jsxcad/geometry-surface";

export const assertGood = (solid) => {
  for (const surface of solid) {
    assertGoodSurface(surface);
  }
};
