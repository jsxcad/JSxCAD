import { hasShowOutline, hasShowSkin, hasShowWireframe } from './show.js';

import { rewrite } from './visit.js';
import { taggedGroup } from './taggedGroup.js';
import { taggedTriangles } from './taggedTriangles.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';
import { toTriangles as toTrianglesFromGraph } from '../graph/toTriangles.js';
import { toTriangles as toTrianglesFromPolygonsWithHoles } from '../polygonsWithHoles/toTriangles.js';

export const soup = (
  geometry,
  { doTriangles = true, doOutline = true, doWireframe = true } = {}
) => {
  const show = (geometry) => {
    if (doTriangles) {
      geometry = hasShowSkin(geometry);
    }
    if (doOutline) {
      geometry = hasShowOutline(geometry);
    }
    if (doWireframe) {
      geometry = hasShowWireframe(geometry);
    }
    return geometry;
  };
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        const { graph } = geometry;
        if (graph.isEmpty) {
          return taggedGroup({});
        } else {
          return show(toTrianglesFromGraph({ tags }, geometry));
        }
      }
      // Unreachable.
      case 'polygons':
        return show(
          taggedTriangles({ tags }, toTrianglesFromPolygonsWithHoles(geometry))
        );
      case 'polygonsWithHoles':
        return show(
          taggedTriangles({ tags }, toTrianglesFromPolygonsWithHoles(geometry))
        );
      case 'segments':
      case 'triangles':
      case 'points':
      case 'paths':
        // Already soupy enough.
        return geometry;
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

  return rewrite(toTransformedGeometry(geometry), op);
};
