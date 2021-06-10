import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { projectToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { realizeGraph } from './realizeGraph.js';
import { scale } from '@jsxcad/math-vec3';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const projectToPlane = (geometry, plane, direction) => {
  let { graph } = geometry;
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
    return taggedGraph(
      {},
      fromSurfaceMeshLazy(
        projectToPlaneOfSurfaceMesh(
          toSurfaceMesh(graph),
          geometry.matrix,
          ...scale(1, direction),
          ...plane
        )
      )
    );
  } else {
    return geometry;
  }
};
