import { measureBoundingBox } from './measureBoundingBox.js';
import { serializeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const prepareForSerialization = (geometry) => {
  const { graph } = geometry;
  if (!graph.serializedSurfaceMesh) {
    measureBoundingBox(geometry);
    graph.serializedSurfaceMesh = serializeSurfaceMesh(toSurfaceMesh(graph));
  }
  return graph;
};
