import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { joinSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const join = (targets, sources) => {
  if (sources.length === 0) {
    return targets;
  }
  targets = targets.map(({ graph, matrix, tags }) => ({
    mesh: toSurfaceMesh(graph),
    matrix,
    tags,
    isPlanar: graph.isPlanar,
    isEmpty: graph.isEmpty,
  }));
  sources = sources.map(({ graph, matrix, tags }) => ({
    mesh: toSurfaceMesh(graph),
    matrix,
    tags,
    isPlanar: graph.isPlanar,
    isEmpty: graph.isEmpty,
  }));
  const { joinedMeshes } = joinSurfaceMeshes(targets, sources);
  const joinedGeometries = joinedMeshes.map(({ matrix, mesh, tags }) =>
    taggedGraph({ tags, matrix }, fromSurfaceMeshLazy(mesh))
  );
  deletePendingSurfaceMeshes();
  return joinedGeometries;
};
