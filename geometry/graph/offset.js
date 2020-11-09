import {
  addEdge,
  addFace,
  addLoop,
  addPoint,
  create,
  eachFace,
  eachLoopEdge,
  getEdgeNode,
  getLoopNode,
  getPointNode,
} from './graph.js';

import { insetOfPolygon } from '@jsxcad/algorithm-cgal';
import { realizeGraph } from './realizeGraph.js';

export const offset = (outlineGraph, amount) => {
  if (amount >= 0) {
    return outlineGraph;
  }
  const offsetGraph = create();
  eachFace(realizeGraph(outlineGraph), (face, { plane, loop, holes }) => {
    const polygon = [];
    eachLoopEdge(outlineGraph, loop, (edge, { point }) => {
      polygon.push(getPointNode(outlineGraph, point));
    });
    // FIX: Handle holes.
    for (const { boundary } of insetOfPolygon(0 - amount, plane, polygon, [])) {
      let offsetFace = addFace(offsetGraph, { plane });
      let offsetLoop = addLoop(offsetGraph, { face: offsetFace });
      let firstEdge;
      let lastEdge;
      for (const pointNode of boundary) {
        const point = addPoint(offsetGraph, pointNode);
        const edge = addEdge(offsetGraph, {
          point,
          next: firstEdge,
          loop: offsetLoop,
        });
        if (firstEdge === undefined) {
          firstEdge = edge;
        }
        if (lastEdge !== undefined) {
          getEdgeNode(offsetGraph, lastEdge).next = edge;
        }
        lastEdge = edge;
      }
      getLoopNode(offsetGraph, offsetLoop).edge = firstEdge;
    }
  });
  offsetGraph.isClosed = false;
  offsetGraph.isOutline = true;
  if (offsetGraph.points.length === 0) {
    offsetGraph.isEmpty = true;
  }
  return offsetGraph;
};
