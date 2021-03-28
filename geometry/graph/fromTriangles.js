// import { create, fillFacetFromPoints } from './graph.js';

// import { equals } from '@jsxcad/math-vec3';
import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
// import { fromPolygonsWithHolesToTriangles } from './fromPolygonsWithHolesToTriangles.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
// import { rerealizeGraph } from './rerealizeGraph.js';

// const X = 0;
// const Y = 1;
// const Z = 2;
// const W = 3;

export const fromTriangles = (triangles) => {
  return fromSurfaceMeshLazy(fromPolygonsToSurfaceMesh(triangles));
  /*
  const graph = create();
  let facet = 0;
  const ensureFace = (plane, exactPlane) => {
    for (let nth = 0; nth < graph.faces.length; nth++) {
      const face = graph.faces[nth];
      // FIX: Use exactPlane.
      if (
        face.plane[X] === plane[X] &&
        face.plane[Y] === plane[Y] &&
        face.plane[Z] === plane[Z] &&
        face.plane[W] === plane[W]
      ) {
        return nth;
      }
    }
    const faceId = graph.faces.length;
    graph.faces[faceId] = { plane, exactPlane };
  };
  for (const { points, exactPoints, plane, exactPlane } of triangles) {
    if (
      equals(points[0], points[1]) ||
      equals(points[1], points[2]) ||
      equals(points[2], points[0])
    ) {
      // throw Error(`Degenerate triangle: ${JSON.stringify(points)}`);
      console.log(`Degenerate triangle: ${JSON.stringify(points)}`);
      continue;
    }
    // FIX: No face association.
    graph.facets[facet] = {
      edge: fillFacetFromPoints(
        graph,
        facet,
        ensureFace(plane, exactPlane),
        points,
        exactPoints
      ),
    };
    facet += 1;
  }
  // We didn't build a stitched graph.
  const rerealized = rerealizeGraph(graph);
  rerealized.provenance = 'fromPolygonsWithHoles';
  return rerealized;
*/
};
