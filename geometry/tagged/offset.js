import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { offset as offsetGraph } from '../graph/offset.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGroup } from './taggedGroup.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const offset = (geometry, initial = 1, step, limit) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedGroup(
          { tags },
          ...offsetGraph(geometry, initial, step, limit)
        );
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'polygonsWithHoles':
        return offset(
          fromPolygonsWithHolesToGraph(geometry),
          initial,
          step,
          limit
        );
      case 'paths':
        return offset(
          fromPathsToGraph(geometry.paths.map((path) => ({ points: path }))),
          initial,
          step,
          limit
        );
      case 'plan':
        return offset(reify(geometry).content[0], initial, step, limit);
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for offset.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
