import { convertPolygonsToMeshes } from '../convertPolygonsToMeshes.js';
import { rewrite } from './visit.js';
import { serialize } from '../serialize.js';
import { taggedGroup } from './taggedGroup.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

export const soup = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        const { graph } = geometry;
        if (graph.isEmpty) {
          return taggedGroup({});
        } else {
          return geometry;
        }
      }
      // Unreachable.
      case 'polygonsWithHoles':
        return geometry;
      case 'segments':
      case 'triangles':
      case 'points':
      case 'paths':
        // Already soupy enough.
        return geometry;
      case 'toolpath':
        // Drop toolpaths for now.
        return taggedGroup({});
      case 'displayGeometry':
        // soup can handle displayGeometry.
        return descend();
      case 'layout':
      case 'plan':
      case 'item':
      case 'sketch':
      case 'group': {
        return descend();
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(
    serialize(convertPolygonsToMeshes(toConcreteGeometry(geometry))),
    op
  );
};
