import { difference as solidDifference } from '@jsxcad/algorithm-bsp-surfaces';
import { difference as z0SurfaceDifference } from '@jsxcad/algorithm-z0surface';

// Note: This doesn't deal with sub-assemblies.
export const difference = (base, ...subtractions) => {
  if (base.solid) {
    const differenced = { solid: base.solid, tags: base.tags };
    for (const subtraction of subtractions) {
      if (subtraction.solid) {
        differenced.solid = solidDifference(differenced.solid, subtraction.solid);
      }
    }
    return differenced;
  } else if (base.z0Surface) {
    const differenced = { z0Surface: base.z0Surface, tags: base.tags };
    for (const subtraction of subtractions) {
      if (subtraction.z0Surface) {
        differenced.z0Surface = z0SurfaceDifference(differenced.z0Surface, subtraction.z0Surface);
      }
    }
    return differenced;
  } else if (base.paths) {
    const differenced = { paths: base.paths, tags: base.tags };
    // FIX: Figure out how paths differencing should work.
    return differenced;
  }
};
