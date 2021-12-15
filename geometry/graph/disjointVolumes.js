import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { disjointClosedSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

const check = true;

// The stationary pivot comes first.
export const disjointVolumes = (geometries) => {
  const request = [];
  for (const { graph, matrix, tags } of geometries) {
    request.push({ mesh: toSurfaceMesh(graph), matrix, tags });
  }
  const disjointGeometries = [];
  for (const { matrix, mesh, tags } of disjointClosedSurfaceMeshes(
    check,
    request.reverse()
  )) {
    disjointGeometries.push(
      taggedGraph({ tags, matrix }, fromSurfaceMeshLazy(mesh))
    );
  }
  deletePendingSurfaceMeshes();
  return disjointGeometries;
};
