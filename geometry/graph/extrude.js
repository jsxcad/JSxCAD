import { extrudeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
// import { realizeGraph } from './realizeGraph.js';
// import { scale } from '@jsxcad/math-vec3';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrude = (graph, height, depth) => {
  /*
  graph = realizeGraph(graph);
  if (graph.faces.length > 0) {
    // Arbitrarily pick the first face normal.
    // FIX: use exactPlane.
    const normal = graph.faces[0].plane;
    return fromSurfaceMeshLazy(
      extrudeSurfaceMesh(
        toSurfaceMesh(graph),
        ...scale(height, normal),
        ...scale(depth, normal)
      )
    );
  } else {
    return graph;
  }
*/
  return fromSurfaceMeshLazy(
    extrudeSurfaceMesh(toSurfaceMesh(graph), height, depth)
  );
};
