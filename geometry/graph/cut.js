import {
  STATUS_EMPTY,
  STATUS_OK,
  STATUS_UNCHANGED,
  cutSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';
import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { fromEmpty } from './fromEmpty.js';
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
  const targetGraphRequests = targetGraphs.map(({ graph, matrix, tags }) => ({
    mesh: toSurfaceMesh(graph),
    matrix,
    tags,
    isPlanar: graph.isPlanar,
    isEmpty: graph.isEmpty,
  }));
  const sourceGraphRequests = sourceGraphs.map(({ graph, matrix, tags }) => ({
    mesh: toSurfaceMesh(graph),
    matrix,
    tags,
    isPlanar: graph.isPlanar,
    isEmpty: graph.isEmpty,
  }));
  const { cutMeshes, cutSegments } = cutSurfaceMeshes(
    targetGraphRequests,
    targetSegments,
    sourceGraphRequests
  );
  const cutGraphGeometries = cutMeshes.map(
    ({ matrix, mesh, tags, status }, index) => {
      switch (status) {
        case STATUS_EMPTY:
          return fromEmpty({ tags });
        case STATUS_UNCHANGED:
          // Preserve identity.
          return targetGraphs[index];
        case STATUS_OK:
          mesh.provenance = 'cut';
          return taggedGraph({ tags, matrix, provenance: 'geometry/graph/cut' }, fromSurfaceMeshLazy(mesh));
      }
    }
  );
  const cutSegmentsGeometries = cutSegments.map(({ matrix, segments, tags }) =>
    taggedSegments({ tags, matrix }, segments)
  );
  deletePendingSurfaceMeshes();
  return { cutGraphGeometries, cutSegmentsGeometries };
};
