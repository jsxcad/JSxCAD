import { union as solidUnion } from '@jsxcad/algorithm-bsp-surfaces';
import { union as z0SurfaceUnion } from '@jsxcad/algorithm-z0surface';

export const unionItems = (base, ...additions) => {
  const unioned = {};
  if (base.tags !== undefined) {
    unioned.tags = base.tags;
  }
  if (base.solid) {
    unioned.solid = base.solid;
    for (const addition of additions) {
      if (addition.solid) {
        unioned.solid = solidUnion(unioned.solid, addition.solid);
      }
    }
  } else if (base.z0Surface) {
    unioned.z0Surface = base.z0Surface;
    for (const addition of additions) {
      if (addition.z0Surface) {
        unioned.z0Surface = z0SurfaceUnion(unioned.z0Surface, addition.z0Surface);
      }
    }
  } else if (base.paths) {
    unioned.paths = base.paths;
    // FIX: Figure out how paths unions should work.
  }
  return unioned;
};
