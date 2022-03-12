import {
  fromSurfaceMesh,
  fromSurfaceMeshToPolygonsWithHoles,
  separateSurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { taggedGraph } from '../tagged/taggedGraph.js';
import { taggedGroup } from '../tagged/taggedGroup.js';
import { taggedPolygonsWithHoles } from '../tagged/taggedPolygonsWithHoles.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const separate = (
  geometry,
  keepShapes = true,
  keepHolesInShapes = true,
  keepHolesAsShapes = false
) => {
  if (geometry.graph.is_closed) {
    return taggedGroup(
      {},
      ...separateSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        keepShapes,
        keepHolesInShapes,
        keepHolesAsShapes
      ).map((mesh) =>
        taggedGraph(
          { tags: geometry.tags, matrix: geometry.matrix },
          fromSurfaceMesh(mesh)
        )
      )
    );
  } else {
    // This is a surface.
    const results = [];
    const arrangements = fromSurfaceMeshToPolygonsWithHoles(
      toSurfaceMesh(geometry.graph)
    );
    for (const { exactPlane, plane, polygonsWithHoles } of arrangements) {
      const shapes = [];
      for (const polygonWithHoles of polygonsWithHoles) {
        if (keepShapes) {
          if (keepHolesInShapes) {
            shapes.push(polygonWithHoles);
          } else {
            shapes.push({ ...polygonWithHoles, holes: [] });
          }
        }
        if (keepHolesAsShapes) {
          for (const hole of polygonWithHoles.holes) {
            shapes.push(hole);
          }
        }
      }
      if (shapes.length > 0) {
        results.push(
          taggedPolygonsWithHoles(
            { tags: geometry.tags, matrix: geometry.matrix, plane, exactPlane },
            shapes
          )
        );
      }
    }
    return taggedGroup({}, ...results);
  }
};
