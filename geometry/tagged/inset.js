import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { inset as insetGraph } from '../graph/inset.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGroup } from './taggedGroup.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const inset = (geometry, initial = 1, step, limit) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedGroup(
          { tags },
          ...insetGraph(geometry, initial, step, limit)
        );
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'polygonsWithHoles':
        return inset(
          fromPolygonsWithHolesToGraph(geometry),
          initial,
          step,
          limit
        );
      case 'paths':
        return inset(
          fromPathsToGraph(geometry.paths.map((path) => ({ points: path }))),
          initial,
          step,
          limit
        );
      case 'plan':
        return inset(reify(geometry).content[0], initial, step, limit);
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for inset.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
