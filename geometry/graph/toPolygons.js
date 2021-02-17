import { eachEdgeLoop, eachFacet, getPointNode } from './graph.js';

import { realizeGraph } from './realizeGraph.js';

export const toPolygons = (graph) => {
  // CHECK: This should already be triangulated.
  const surface = [];
  eachFacet(realizeGraph(graph), (facet, { edge }) => {
    const polygon = [];
    eachEdgeLoop(graph, edge, (edge, { point }) => {
      polygon.push(getPointNode(graph, point));
    });
    surface.push(polygon);
  });
  return surface;
};
