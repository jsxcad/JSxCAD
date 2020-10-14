import { extrudeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { scale } from '@jsxcad/math-vec3';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrude = (graph, height, depth) => {
  if (graph.faces.length > 0) {
    // Arbitrarily pick the plane of the first graph to extrude along.
    const normal = graph.faces[0].plane;
    return fromSurfaceMesh(
      extrudeSurfaceMesh(
        toSurfaceMesh(graph),
        ...scale(height, normal),
        ...scale(depth, normal)
      )
    );
  } else {
    return graph;
  }
};
