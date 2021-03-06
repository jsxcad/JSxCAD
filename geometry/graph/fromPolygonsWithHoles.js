import { create, fillFacetFromPoints } from './graph.js';
import { rerealizeGraph } from './rerealizeGraph.js';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

// FIX: Actually, this doesn't do holes.
export const fromPolygonsWithHoles = (polygonsWithHoles) => {
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
  // FIX: If we want to build a graph, these need to be triangulated.
  for (const { points, exactPoints, plane, exactPlane } of polygonsWithHoles) {
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
  return rerealizeGraph(graph);
};
