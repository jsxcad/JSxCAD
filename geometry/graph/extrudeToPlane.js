import { extrudeToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { scale } from '@jsxcad/math-vec3';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

// FIX: The face needs to be selected with the transform in mind.
export const extrudeToPlane = (geometry, highPlane, lowPlane, direction) => {
  if (geometry.graph.isEmpty) {
    return geometry;
  }
  return taggedGraph(
    { tags: geometry.tags },
    fromSurfaceMeshLazy(
      extrudeToPlaneOfSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        ...scale(1, direction),
        ...highPlane,
        ...scale(-1, direction),
        ...lowPlane
      )
    )
  );
};
