import { extrudeToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { realizeGraph } from './realizeGraph.js';
import { scale } from '@jsxcad/math-vec3';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrudeToPlane = (graph, highPlane, lowPlane) => {
  if (realizeGraph(graph).faces.length > 0) {
    // Arbitrarily pick the plane of the first graph to extrude along.
    let normal;
    for (const face of graph.faces) {
      if (face && face.plane) {
        normal = face.plane;
        break;
      }
    }
    return fromSurfaceMeshLazy(
      extrudeToPlaneOfSurfaceMesh(
        toSurfaceMesh(graph),
        ...scale(1, normal),
        ...highPlane,
        ...scale(-1, normal),
        ...lowPlane
      )
    );
  } else {
    return graph;
  }
};
