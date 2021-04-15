import { serializeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const prepareForSerialization = (graph) => {
  if (!graph.serializedSurfaceMesh) {
    graph.serializedSurfaceMesh = serializeSurfaceMesh(toSurfaceMesh(graph));
  }
  return graph;
};
