import { toPaths, toSolid, toSurface } from '@jsxcad/geometry-graph';
import { rewrite } from './visit.js';
import { taggedPaths } from './taggedPaths.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const soup = (geometry) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        const { graph } = geometry;
        if (graph.isWireframe) {
          return taggedPaths({ tags }, toPaths(graph));
        } else if (graph.isClosed) {
          return taggedSolid({ tags }, toSolid(graph));
        } else {
          return taggedSurface({ tags }, toSurface(graph));
        }
      }
      case 'solid':
      case 'z0Surface':
      case 'surface':
      case 'points':
      case 'paths':
        // Already soupy enough.
        return geometry;
      case 'layout':
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
