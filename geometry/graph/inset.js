import {
  addFace,
  addHoleFromPoints,
  addLoopFromPoints,
  create,
  eachFace,
  eachLoopEdge,
  getPointNode,
} from './graph.js';

import { canonicalize as canonicalizePlane } from '@jsxcad/math-plane';
import { insetOfPolygon } from '@jsxcad/algorithm-cgal';
import { outline } from './outline.js';
import { realizeGraph } from './realizeGraph.js';

export const inset = (graph, initial, step, limit) => {
  const outlineGraph = outline(graph);
  const offsetGraph = create();
  eachFace(realizeGraph(outlineGraph), (face, { plane, loop, holes }) => {
    const polygon = [];
    eachLoopEdge(outlineGraph, loop, (edge, { point }) => {
      polygon.push(getPointNode(outlineGraph, point));
    });
    const polygonHoles = [];
    if (holes) {
      for (const hole of holes) {
        const polygon = [];
        eachLoopEdge(outlineGraph, hole, (edge, { point }) => {
          polygon.push(getPointNode(outlineGraph, point));
        });
        polygonHoles.push(polygon);
      }
    }
    for (const { boundary, holes } of insetOfPolygon(
      initial,
      step,
      limit,
      canonicalizePlane(plane), // FIX: Use exact transforms to avoid drift.
      polygon,
      polygonHoles
    )) {
      let offsetFace = addFace(offsetGraph, { plane });
      addLoopFromPoints(offsetGraph, boundary, { face: offsetFace });
      for (const hole of holes) {
        addHoleFromPoints(offsetGraph, hole, { face: offsetFace });
      }
    }
  });
  offsetGraph.isClosed = false;
  offsetGraph.isOutline = true;
  if (offsetGraph.points.length === 0) {
    offsetGraph.isEmpty = true;
  }
  return offsetGraph;
};
