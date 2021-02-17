import { create, fillFacetFromPoints } from './graph.js';

export const fromArrangements = (arrangements) => {
  const graph = create();
  let facet = 0;
  for (const { boundary, holes, plane } of arrangements) {
    // FIX: No face association.
    graph.facets[facet] = {
      edge: fillFacetFromPoints(graph, facet, facet, boundary),
    };
    graph.faces[facet] = { plane };
    facet += 1;
    for (const hole of holes) {
      // FIX: No relationship between hole and boundary.
      graph.facets[facet] = {
        edge: fillFacetFromPoints(graph, facet, facet, hole),
      };
      graph.faces[facet] = { plane };
      facet += 1;
    }
  }
  return graph;
};
