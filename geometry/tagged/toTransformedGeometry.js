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
        return {
          ...geometry,
          assembly: geometry.assembly.map(geometry => walk(matrix, geometry))
        };
      } else if (geometry.disjointAssembly) {
        return {
          ...geometry,
          disjointAssembly: geometry.disjointAssembly.map(geometry => walk(matrix, geometry))
        };
      } else if (geometry.item) {
        return {
          ...geometry,
          item: walk(matrix, geometry.item)
        };
      }

      return transformItem(matrix, geometry);
    };

    geometry.transformed = walk(identity(), geometry);
  }
  return geometry.transformed;
};
