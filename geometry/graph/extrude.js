import { extrudeSurfaceMesh, fromSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrude = (geometry, height, depth, normal) => {
  if (geometry.graph.isEmpty) {
    return geometry;
  }
  const dir = {};
  if (normal.points && normal.points.length >= 1) {
    dir.direction = normal.points[0];
  }
  if (normal.exactPoints && normal.exactPoints.length >= 1) {
    dir.exactDirection = normal.exactPoints[0];
  }
  const extrudedMesh = extrudeSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    height,
    depth,
    dir
  );
  if (!extrudedMesh) {
    console.log(`Extrusion failed`);
  }
  return taggedGraph({ tags: geometry.tags }, fromSurfaceMesh(extrudedMesh));
};
