import {
  fromSolid as fromSolidToBsp,
  unifyBspTrees,
} from '@jsxcad/geometry-bsp';

import { fromSurface as fromSurfaceToSolid } from '@jsxcad/geometry-solid';
import { visit } from './visit.js';

export const toBspTree = (geometry, normalize) => {
  // Start with an empty tree.
  let bspTree = fromSolidToBsp([], normalize);
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'solid': {
        bspTree = unifyBspTrees(
          bspTree,
          fromSolidToBsp(geometry.solid, normalize)
        );
        return descend();
      }
      // FIX: We want some distinction between volumes for membership and volumes for composition.
      case 'surface':
      case 'z0Surface': {
        bspTree = unifyBspTrees(
          bspTree,
          fromSolidToBsp(
            fromSurfaceToSolid(
              geometry.surface || geometry.z0Surface,
              normalize
            ),
            normalize
          )
        );
        return descend();
      }
      case 'paths':
      case 'points':
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers':
      case 'sketch': {
        return descend();
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  visit(geometry, op);

  return bspTree;
};
