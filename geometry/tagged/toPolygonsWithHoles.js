import { isVoid } from './isNotVoid.js';
import { taggedPolygonsWithHoles } from './taggedPolygonsWithHoles.js';
import { toPolygonsWithHoles as toPolygonsWithHolesFromGraph } from '../graph/toPolygonsWithHoles.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';
import { visit } from './visit.js';

export const toPolygonsWithHoles = (geometry) => {
  const output = [];

  const op = (geometry, descend) => {
    if (isVoid(geometry)) {
      return;
    }
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        for (const {
          plane,
          exactPlane,
          polygonsWithHoles,
        } of toPolygonsWithHolesFromGraph(geometry)) {
          output.push(
            taggedPolygonsWithHoles(
              { tags, plane, exactPlane },
              polygonsWithHoles
            )
          );
        }
        break;
      }
      // FIX: Support 'triangles'?
      case 'segments':
      case 'points':
      case 'paths':
      case 'sketch':
        break;
      case 'layout':
      case 'plan':
      case 'item':
      case 'group': {
        return descend();
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  visit(toTransformedGeometry(geometry), op);

  return output;
};
