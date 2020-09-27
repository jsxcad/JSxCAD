// Note that merging produces duplicate points.

import { eachFace, eachFaceLoop, eachLoopEdge, getEdgeNode, getFaceNode, getLoopNode, spliceLoop } from './graph.js';
import { equalsPlane } from './equalsPlane.js';

export const mergeLoops = (graph) => {
  eachFace(graph, (face, faceNode) => {
    eachFaceLoop(graph, face, (loop) => {
      eachLoopEdge(graph, loop, (edge, edgeNode) => {
        const twin = edgeNode.twin;
        if (twin === -1) {
          return;
        }
        const twinNode = getEdgeNode(graph, twin);
        const twinLoop = twinNode.loop; // FIX: loop -> face
        if (twinLoop === face) {
          // We don't handle self-merges here.
          return;
        }
        const twinLoopNode = getLoopNode(graph, twinLoop);
        const twinFaceNode = getFaceNode(graph, twinLoopNode.face);
        if (!equalsPlane(faceNode.plane, twinFaceNode.plane)) {
          // These faces are not coplanar -- we can't merge them.
          return;
        }

        spliceLoop(graph, twinLoop, edge);
      });
    });
  });
  return graph;
};
