import { extrudeToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { realizeGraph } from './realizeGraph.js';
import { scale } from '@jsxcad/math-vec3';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrudeToPlane = (graph, highPlane, lowPlane, direction) => {
  graph = realizeGraph(graph);
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
    return fromSurfaceMeshLazy(
      extrudeToPlaneOfSurfaceMesh(
        toSurfaceMesh(graph),
        ...scale(1, direction),
        ...highPlane,
        ...scale(-1, direction),
        ...lowPlane
      )
    );
  } else {
    return graph;
  }
};
