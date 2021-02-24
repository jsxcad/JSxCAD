import { extrude as extrudeGraph } from '@jsxcad/geometry-graph';
import { fill } from './fill.js';
import { reify } from './reify.js';
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
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return extrude(fill(geometry), height, depth);
      case 'plan':
        return extrude(reify(geometry).content[0], height, depth);
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

  // CHECK: Why does this need transformed geometry?
  return rewrite(toTransformedGeometry(geometry), op);
};
