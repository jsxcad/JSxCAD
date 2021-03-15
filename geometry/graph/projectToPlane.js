import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { projectToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { realizeGraph } from './realizeGraph.js';
import { scale } from '@jsxcad/math-vec3';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const projectToPlane = (graph, plane, direction) => {
  graph = realizeGraph(graph);
  if (graph.faces.length > 0) {
    // Arbitrarily pick the plane of the first graph to project along.
    if (direction === undefined) {
      for (const face of graph.faces) {
        if (face && face.plane) {
          direction = face.plane;
          break;
        }
      }
    }
    return fromSurfaceMeshLazy(
      projectToPlaneOfSurfaceMesh(
        toSurfaceMesh(graph),
        ...scale(1, direction),
        ...plane
      )
    );
  } else {
    return graph;
  }
};
