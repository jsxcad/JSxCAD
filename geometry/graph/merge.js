// Note that merging produces duplicate points.

import { eachFace, eachFaceEdge } from './graph.js';
import { equalsPlane } from './junction.js';

export const mergeFaces = (graph) => {
  eachFace(graph, (face, faceNode) => {
    eachFaceEdge(graph, face, (edge, edgeNode) => {
      const twin = edgeNode.twin;
      if (twin === -1) {
        return;
      }
      const twinNode = graph.edge[twin];
      const twinFace = twinNode.face;
      if (twinFace === face) {
        // We don't handle self-merges here.
        return;
      }
      const twinFaceNode = graph.face[twinFace];
      if (!equalsPlane(faceNode.plane, twinFaceNode.plane)) {
        // These faces are not coplanar -- we can't merge them.
        return;
      }

      // This face will consume the edges of the other face.
      let lastTwinEdgeNode;
      eachFaceEdge(graph, twinFace, (twinEdge, twinEdgeNode) => {
        // Update face affinity.
        twinEdgeNode.face = face;
        // Remember the last node for when we splice it in.
        lastTwinEdgeNode = twinEdgeNode;
      });

      // Splice in the edges of the other face.
      lastTwinEdgeNode.next = edgeNode.next;
      edgeNode.next = twin;

      // Decouple the old face from the edges.
      twinFaceNode.edge = -1;
    });
  });
  return graph;
};
