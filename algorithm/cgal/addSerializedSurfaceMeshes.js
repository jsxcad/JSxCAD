import { serializeSurfaceMesh } from './serializeSurfaceMesh.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const addSerializedSurfaceMeshes = (geometries) => {
  for (const { type, graph } of geometries) {
    if (type === 'graph') {
      graph.serializedSurfaceMesh = serializeSurfaceMesh(toSurfaceMesh(graph));
    }
  }
  return geometries;
};
