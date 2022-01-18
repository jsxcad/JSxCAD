import { computeHash } from '@jsxcad/sys';
import { measureBoundingBox } from './measureBoundingBox.js';
import { serializeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const prepareForSerialization = (geometry) => {
  const { graph } = geometry;
  if (!graph.isEmpty && !graph.serializedSurfaceMesh) {
    measureBoundingBox(geometry);
    graph.serializedSurfaceMesh = serializeSurfaceMesh(toSurfaceMesh(graph));
    graph.hash = computeHash(graph);
  }
  return graph;
};
