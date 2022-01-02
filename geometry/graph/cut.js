import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { cutSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { taggedSegments } from '../tagged/taggedSegments.js';

/*
export const cut = (targets, sources) => {
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
  // Reverse the sources to get the same cut order as disjoint.
  const results = cutSurfaceMeshes(targets, sources.reverse());
  const cutGeometries = results.map(({ matrix, mesh, tags }) =>
    taggedGraph({ tags, matrix }, fromSurfaceMeshLazy(mesh))
  );
  deletePendingSurfaceMeshes();
  return cutGeometries;
};
*/

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
