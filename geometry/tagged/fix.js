import {
  fromSolid as fromSolidToBsp,
  toConvexSolids,
} from '@jsxcad/geometry-bsp';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { rewrite } from './visit.js';
import { taggedDisjointAssembly } from './taggedDisjointAssembly.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';

export const fix = (geometry) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'solid': {
        const normalize = createNormalize3();
        const bsp = fromSolidToBsp(geometry.solid, normalize);
        const convexSolids = toConvexSolids(bsp, normalize);
        if (convexSolids.length === 1) {
          convexSolids[0].tags = tags;
          return convexSolids[0];
        } else {
          return taggedDisjointAssembly({ tags }, ...convexSolids);
        }
      }
      case 'surface':
      case 'z0Surface':
      case 'paths':
      case 'points':
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers':
      case 'sketch':
        // Sketches aren't real for union.
        return descend();
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toDisjointGeometry(geometry), op);
};

export default fix;
