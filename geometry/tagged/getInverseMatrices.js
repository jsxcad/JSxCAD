import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { toConcreteGeometry } from './toConcreteGeometry.js';

export const getInverseMatrices = (geometry) => {
  geometry = toConcreteGeometry(geometry);
  switch (geometry.type) {
    case 'item': {
      // These maintain an invertible matrix.
      const global = geometry.matrix;
      const local = invertTransform(global);
      return { global, local };
    }
    case 'segments': {
      // This is a bit trickier.
      // We transform the matrices such that the first segment starts at [0, 0, 0], and extends to [length, 0, 0].
      const {
        orientation = [
          [0, 0, 0],
          [0, 0, 1],
          [1, 0, 0],
        ],
        segments,
      } = geometry;
      if (segments.length < 1) {
        // There's nothing to do.
        return { global: geometry.matrix, local: geometry.matrix };
      }
      const local = fromSegmentToInverseTransform(segments[0], orientation);
      const global = invertTransform(local);
      return { global, local };
    }
    default: {
      return {
        global: geometry.matrix,
        local: invertTransform(geometry.matrix),
      };
    }
  }
};
