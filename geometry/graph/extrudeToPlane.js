import { extrudeToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { realizeGraph } from './realizeGraph.js';
import { scale } from '@jsxcad/math-vec3';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

// FIX: The face needs to be selected with the transform in mind.
export const extrudeToPlane = (geometry, highPlane, lowPlane, direction) => {
  let graph = realizeGraph(geometry.graph);
  if (graph.faces.length > 0) {
    // Arbitrarily pick the plane of the first graph to extrude along.
    if (direction === undefined) {
      for (const face of graph.faces) {
        if (face && face.plane) {
          direction = face.plane;
          break;
        }
      }
    }
    return taggedGraph(
      { tags: geometry.tags },
      fromSurfaceMeshLazy(
        extrudeToPlaneOfSurfaceMesh(
          toSurfaceMesh(graph),
          geometry.matrix,
          ...scale(1, direction),
          ...highPlane,
          ...scale(-1, direction),
          ...lowPlane
        )
      )
    );
  } else {
    return geometry;
  }
};
