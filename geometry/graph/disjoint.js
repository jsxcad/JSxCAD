import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { disjunctionOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const disjoint = (geometries) => {
  const request = [];
  for (const { graph, matrix, tags } of geometries) {
    request.push({ mesh: toSurfaceMesh(graph), matrix, tags });
  }
  const disjointGeometries = [];
  for (const { matrix, mesh, tags } of disjunctionOfSurfaceMeshes(request)) {
    disjointGeometries.push(
      taggedGraph({ tags, matrix }, fromSurfaceMeshLazy(mesh))
    );
  }
  deletePendingSurfaceMeshes();
  return disjointGeometries;
};
