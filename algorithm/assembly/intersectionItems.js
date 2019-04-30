import { intersection as solidIntersection } from '@jsxcad/algorithm-bsp-surfaces';
import { intersection as z0SurfaceIntersection } from '@jsxcad/algorithm-z0surface';

export const intersectionItems = (base, ...additions) => {
  const intersectioned = {};
  if (base.tags !== undefined) {
    intersectioned.tags = base.tags;
  }
  if (base.solid) {
    intersectioned.solid = base.solid;
    for (const addition of additions) {
      if (addition.solid) {
        intersectioned.solid = solidIntersection(intersectioned.solid, addition.solid);
      }
    }
  } else if (base.z0Surface) {
    intersectioned.z0Surface = base.z0Surface;
    for (const addition of additions) {
      if (addition.z0Surface) {
        intersectioned.z0Surface = z0SurfaceIntersection(intersectioned.z0Surface, addition.z0Surface);
      }
    }
  } else if (base.paths) {
    intersectioned.paths = base.paths;
    // FIX: Figure out how paths intersections should work.
  }
  return intersectioned;
};
