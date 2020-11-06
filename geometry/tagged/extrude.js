import { extrude as extrudeGraph } from '@jsxcad/geometry-graph';
import { interior } from './interior.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const extrude = (geometry, height, depth) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        return taggedGraph(
          { tags },
          extrudeGraph(geometry.graph, height, depth)
        );
      }
      case 'solid':
      case 'z0Surface':
      case 'surface':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return extrude(interior(geometry), height, depth);
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for extrude.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
