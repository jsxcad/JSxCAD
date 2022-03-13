import {
  deletePendingSurfaceMeshes,
  fromSurfaceMesh,
  fuseSurfaceMeshes,
  toSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fuse = (sources) => {
  if (sources.length < 2) {
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
    taggedGraph({ provenance: 'geometry/graph/fuse' }, fromSurfaceMesh(mesh))
  );
  deletePendingSurfaceMeshes();
  return fusedGeometries;
};
