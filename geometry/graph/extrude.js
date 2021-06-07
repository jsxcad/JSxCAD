import { extrudeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrude = (graph, height, depth) => {
  const extrudedMesh = extrudeSurfaceMesh(toSurfaceMesh(graph), height, depth);
  if (!extrudedMesh) {
    console.log(`Extrusion failed`);
  }
  return fromSurfaceMeshLazy(extrudedMesh);
};
