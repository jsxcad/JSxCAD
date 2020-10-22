import { extrudeToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { scale } from '@jsxcad/math-vec3';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrudeToPlane = (graph, highPlane, lowPlane) => {
  if (graph.faces.length > 0) {
    // Arbitrarily pick the plane of the first graph to extrude along.
    let normal;
    for (const face of graph.faces) {
      if (face && face.plane) {
        normal = face.plane;
        break;
      }
    }
    return fromSurfaceMesh(
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
