import { hasShowOutline, hasShowSkin, hasShowWireframe } from './show.js';

import { isNotTypeVoid } from './type.js';
import { rewrite } from './visit.js';
import { serialize } from '../serialize.js';
import { taggedGroup } from './taggedGroup.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

export const soup = (
  geometry,
  { doTriangles = true, doOutline = true, doWireframe = true } = {}
) => {
  geometry = serialize(geometry);
  const show = (geometry) => {
    if (doTriangles) {
      geometry = hasShowSkin(geometry);
    }
    if (doOutline /* && isNotTypeVoid(geometry) */) {
      geometry = hasShowOutline(geometry);
    }
    if (doWireframe && isNotTypeVoid(geometry)) {
      geometry = hasShowWireframe(geometry);
    }
    return geometry;
  };
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        const { graph } = geometry;
        if (!graph) {
          console.log(JSON.stringify(geometry));
        }
        if (graph.isEmpty) {
          return taggedGroup({});
        } else {
          return show(geometry);
        }
      }
      // Unreachable.
      case 'polygonsWithHoles':
        return show(geometry);
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

  return rewrite(toConcreteGeometry(geometry), op);
};
