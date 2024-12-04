import {
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { toConcreteGeometry } from './toConcreteGeometry.js';

export const getInverseMatrices = (geometry) => {
  geometry = toConcreteGeometry(geometry);
  switch (geometry.type) {
    case 'plan': {
      if (geometry.content.length === 1) {
        return getInverseMatrices(geometry.content[0]);
      }
    }
    // fallthrough
    default: {
      return {
        global: geometry.matrix,
        local: invertTransform(geometry.matrix),
      };
    }
  }
};
