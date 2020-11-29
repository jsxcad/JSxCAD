import {
  addFace,
  addLoop,
  addLoopEdge,
  addPoint,
  create,
  eachFace,
  eachFaceEdge,
  getEdgeNode,
} from './graph.js';

import { toPlane } from '@jsxcad/math-poly3';

/**
 * fromSolid
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @param {boolean} closed
 * @returns {Loops}
 */
export const fromSolid = (solid, normalize, closed = true, verbose = false) => {
  const twinMap = new Map();
  /**
   * getTwins
   *
   * @param {Point} point
   * @returns {Edge[]}
   */
  const getTwins = (point) => {
    let twins = twinMap.get(point);
    if (twins === undefined) {
      twins = [];
      twinMap.set(point, twins);
    }
    return twins;
  };
  const graph = create();

  for (const surface of solid) {
    for (const path of surface) {
      const face = addFace(graph, { plane: toPlane(path) });
      const loop = addLoop(graph, { face });
      for (let nth = 0; nth < path.length; nth++) {
        const thisPoint = normalize(path[nth]);
        const nextPoint = normalize(path[(nth + 1) % path.length]);
        const edge = addLoopEdge(graph, loop, {
          point: addPoint(graph, thisPoint),
        });
        // nextPoint will be the start of the twin.
        getTwins(addPoint(graph, nextPoint)).push(edge);
      }
    }
  }

  // Bridge the edges.
  let duplicateEdgeCount = 0;
  eachFace(graph, (face, faceNode) => {
    eachFaceEdge(graph, face, (edge, edgeNode) => {
      const nextNode = getEdgeNode(graph, edgeNode.next);
      if (edgeNode.twin === -1) {
        const candidates = twinMap.get(edgeNode.point);
        if (candidates === undefined) {
          throw Error('die');
        }
        // FIX: Assert one or zero twins?
        // Find the candidate that starts where we end.
        let count = 0;
        for (const candidate of candidates) {
          const candidateNode = getEdgeNode(graph, candidate);
          if (candidateNode.point === nextNode.point) {
            count += 1;
            if (candidateNode.twin === -1) {
              candidateNode.twin = edge;
              edgeNode.twin = candidate;
            } else {
              duplicateEdgeCount += 1;
              // throw Error('die');
            }
          }
        }
        if (count > 1) {
          // console.log(`QQ/fromSolid/twins: multiple ${count} ${link.point} -> ${link.next.point}`);
        } else if (count === 0) {
          // console.log(`QQ/fromSolid/twins: none ${link.point} -> ${link.next.point} ${link.face.id}`);
        } else if (count === 1) {
          // console.log(`QQ/fromSolid/twins: one ${link.point} -> ${link.next.point} ${link.face.id} to ${link.twin.point} -> ${link.twin.next.point} ${link.twin.face.id}`);
        }
      }
    });
  });

  if (duplicateEdgeCount > 0) {
    // console.log(`warning: duplicateEdgeCount = ${duplicateEdgeCount}`);
    throw Error(`die: duplicateEdgeCount = ${duplicateEdgeCount}`);
  }

  let holeCount = 0;
  let edgeCount = 0;

  if (closed) {
    eachFace(graph, (face, faceNode) => {
      eachFaceEdge(graph, face, (edge, edgeNode) => {
        edgeCount += 1;
        if (edgeNode.twin === -1) {
          // A hole in the 2-manifold.
          holeCount += 1;
        }
      });
    });
  }

  if (verbose && holeCount > 0) {
    console.log(`QQ/halfedge/fromSolid/holeCount: ${holeCount}`);
    console.log(`QQ/halfedge/fromSolid/edgeCount: ${edgeCount}`);
  }

  return graph;
};

export default fromSolid;
