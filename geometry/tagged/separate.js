import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { separate as separateGraph } from '../graph/separate.js';

export const separate = (
  geometry,
  keepVolumes = true,
  keepCavitiesInVolumes = true,
  keepCavitiesAsVolumes = false
) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return separateGraph(
          geometry,
          keepVolumes,
          keepCavitiesInVolumes,
          keepCavitiesAsVolumes
        );
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return separate(
          reify(geometry).content[0],
          keepVolumes,
          keepCavitiesInVolumes,
          keepCavitiesAsVolumes
        );
      case 'item':
      case 'group': {
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

  return rewrite(geometry, op);
};
