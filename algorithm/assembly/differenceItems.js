import { difference as solidDifference } from '@jsxcad/algorithm-bsp-surfaces';
import { difference as z0SurfaceDifference } from '@jsxcad/algorithm-z0surface';

export const differenceItems = (base, ...subtractions) => {
  const differenced = { tags: base.tags };
  if (base.solid) {
    differenced.solid = base.solid;
    for (const subtraction of subtractions) {
      if (subtraction.solid) {
        differenced.solid = solidDifference(differenced.solid, subtraction.solid);
      }
    }
  } else if (base.z0Surface) {
    differenced.z0Surface = base.z0Surface;
    for (const subtraction of subtractions) {
      if (subtraction.z0Surface) {
        differenced.z0Surface = z0SurfaceDifference(differenced.z0Surface, subtraction.z0Surface);
      }
    }
    return differenced;
  } else if (base.paths) {
    differenced.paths = base.paths;
    // FIX: Figure out how paths differencing should work.
  }
  return differenced;
};
