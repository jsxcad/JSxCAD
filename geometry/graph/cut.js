import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { cutSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { taggedSegments } from '../tagged/taggedSegments.js';

export const cut = (targetGraphs, targetSegments, sourceGraphs) => {
  if (sourceGraphs.length === 0) {
    return {
      cutGraphGeometries: targetGraphs,
      cutSegmentsGeometries: targetSegments,
    };
  }
  targetGraphs = targetGraphs.map(({ graph, matrix, tags }) => ({
    mesh: toSurfaceMesh(graph),
    matrix,
    tags,
    isPlanar: graph.isPlanar,
    isEmpty: graph.isEmpty,
  }));
  sourceGraphs = sourceGraphs.map(({ graph, matrix, tags }) => ({
    mesh: toSurfaceMesh(graph),
    matrix,
    tags,
    isPlanar: graph.isPlanar,
    isEmpty: graph.isEmpty,
  }));
  const { cutMeshes, cutSegments } = cutSurfaceMeshes(
    targetGraphs,
    targetSegments,
    sourceGraphs
  );
  const cutGraphGeometries = cutMeshes.map(({ matrix, mesh, tags }) =>
    taggedGraph({ tags, matrix }, fromSurfaceMeshLazy(mesh))
  );
  const cutSegmentsGeometries = cutSegments.map(({ matrix, segments, tags }) =>
    taggedSegments({ tags, matrix }, segments)
  );
  deletePendingSurfaceMeshes();
  return { cutGraphGeometries, cutSegmentsGeometries };
};
