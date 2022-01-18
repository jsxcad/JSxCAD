import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { fuseSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fuse = (sources) => {
  if (sources.length === 0) {
    return sources;
  }
  sources = sources.map(({ graph, matrix, tags }) => ({
    mesh: toSurfaceMesh(graph),
    matrix,
    tags,
    isEmpty: graph.isEmpty,
  }));
  const { fusedMeshes } = fuseSurfaceMeshes(sources);
  const fusedGeometries = fusedMeshes.map(({ mesh }) =>
    taggedGraph({ provenance: 'geometry/graph/fuse' }, fromSurfaceMeshLazy(mesh))
  );
  deletePendingSurfaceMeshes();
  return fusedGeometries;
};
