import { extrudeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrude = (geometry, height, depth, direction = {}) => {
  const extrudedMesh = extrudeSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    height,
    depth,
    direction
  );
  if (!extrudedMesh) {
    console.log(`Extrusion failed`);
  }
  return taggedGraph(
    { tags: geometry.tags },
    fromSurfaceMeshLazy(extrudedMesh)
  );
};
