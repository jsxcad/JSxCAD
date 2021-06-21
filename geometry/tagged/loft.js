import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { loft as loftGraph } from '../graph/loft.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGroup } from './taggedGroup.js';

export const loft = (a, b) => {
  b = reify(b);
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        const lofts = [];
        for (const bGraph of getNonVoidGraphs(b)) {
          lofts.push(loftGraph(geometry, bGraph));
        }
        return taggedGroup({}, ...lofts);
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return loft(reify(geometry).content[0], b);
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(a, op);
};
