import { identity, multiply } from '@jsxcad/math-mat4';

import { addTags } from './addTags';
import { transformItem } from './transform';

// Apply the accumulated matrix transformations and produce a geometry without them.

export const toTransformedGeometry = (geometry) => {
  if (geometry.transformedGeometry === undefined) {
    const walk = (matrix, geometry) => {
      if (geometry.matrix) {
        // Preserve any tags applied to the untransformed geometry.
        return addTags(geometry.tags,
                       walk(multiply(matrix, geometry.matrix),
                            geometry.untransformed));
      }

      if (geometry.assembly) {
        return {
          ...geometry,
          assembly: geometry.assembly.map(geometry => walk(matrix, geometry))
        };
      }

      return transformItem(matrix, geometry);
    };

    geometry.transformed = walk(identity(), geometry);
  }
  return geometry.transformed;
};
