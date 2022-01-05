export const toPolygons = (geometry) => {
  throw Error('deprecated');
};

/*
import { eachEdgeLoop, eachFacet, getPointNode } from './graph.js';

import { realizeGraph } from './realizeGraph.js';

export const toPolygons = (geometry) => {
  // CHECK: This should already be triangulated.
  const surface = [];
  eachFacet(realizeGraph(geometry.graph), (facet, { edge }) => {
    const polygon = [];
    eachEdgeLoop(geometry.graph, edge, (edge, { point }) => {
      polygon.push(getPointNode(geometry.graph, point));
    });
    surface.push(polygon);
  });
  return surface;
};
*/
