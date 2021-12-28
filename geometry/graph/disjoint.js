import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { disjointSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

const check = false;

// The stationary pivot comes first.
export const disjoint = (geometries) => {
  if (geometries.length < 2) {
    return geometries;
  }
  const request = [];
  for (const { graph, matrix, tags } of geometries) {
    request.push({ mesh: toSurfaceMesh(graph), matrix, tags });
  }
  const disjointGeometries = [];
  const results = disjointSurfaceMeshes(request.reverse(), check);
  for (const { matrix, mesh, tags } of results) {
    disjointGeometries.push(
      taggedGraph({ tags, matrix }, fromSurfaceMeshLazy(mesh))
    );
  }
  deletePendingSurfaceMeshes();
  return disjointGeometries.reverse();
};
