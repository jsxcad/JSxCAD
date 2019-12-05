import { identity, multiply } from '@jsxcad/math-mat4';

import { transformItem } from './transform';

// Apply the accumulated matrix transformations and produce a geometry without them.

export const toTransformedGeometry = (geometry) => {
  if (geometry.transformedGeometry === undefined) {
    const walk = (matrix, geometry) => {
      if (geometry.matrix) {
        // Preserve any tags applied to the untransformed geometry.
        // FIX: Ensure tags are merged between transformed and untransformed upon resolution.
        return walk(multiply(matrix, geometry.matrix),
                    geometry.untransformed);
      }

      if (geometry.assembly) {
        // CHECK: Why at this level?
        return {
          assembly: geometry.assembly.map(geometry => walk(matrix, geometry)),
          tags: geometry.tags
        };
      } else if (geometry.disjointAssembly) {
        // CHECK: Why at this level?
        return {
          disjointAssembly: geometry.disjointAssembly.map(geometry => walk(matrix, geometry)),
          tags: geometry.tags
        };
      } else if (geometry.item) {
        // CHECK: Why at this level?
        return {
          item: walk(matrix, geometry.item),
          tags: geometry.tags
        };
      }
      // else if (geometry.visualization) {
      //   return { ...geometry, visualization: walk(matrix, geometry.visualization) };
      // }
      return transformItem(matrix, geometry);
    };

    geometry.transformed = walk(identity(), geometry);
  }
  return geometry.transformed;
};
