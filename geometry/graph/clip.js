import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { clipSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { taggedSegments } from '../tagged/taggedSegments.js';

export const clip = (targetGraphs, targetSegments, sourceGraphs) => {
  if (sourceGraphs.length === 0) {
    return { clippedGraphs: targetGraphs, clippedSegments: targetSegments };
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
  const { clippedMeshes, clippedSegments } = clipSurfaceMeshes(
    targetGraphs,
    targetSegments,
    sourceGraphs
  );
  const clippedGraphGeometries = clippedMeshes.map(({ matrix, mesh, tags }) =>
    taggedGraph({ tags, matrix }, fromSurfaceMeshLazy(mesh))
  );
  const clippedSegmentsGeometries = clippedSegments.map(
    ({ matrix, segments, tags }) => taggedSegments({ tags, matrix }, segments)
  );
  deletePendingSurfaceMeshes();
  return { clippedGraphGeometries, clippedSegmentsGeometries };
};
