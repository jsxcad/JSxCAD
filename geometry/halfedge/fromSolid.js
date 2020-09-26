import './types.js';

import {
  addEdge,
  addFace,
  addFaceEdge,
  addPoint,
  create,
  eachFace,
  eachFaceEdge,
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
      for (let nth = 0; nth < path.length; nth++) {
        const thisPoint = normalize(path[nth]);
        const nextPoint = normalize(path[(nth + 1) % path.length]);
        const edge = addFaceEdge(graph, face, {
          start: addPoint(graph, thisPoint),
        });
        const edgeNode = graph.edge[edge];
        // nextPoint will be the start of the twin.
        getTwins(nextPoint).push(edge);
      }
    }
  }

  // Bridge the edges.
  let duplicateEdgeCount = 0;
  eachFace(graph, (face, faceNode) => {
    eachFaceEdge(graph, face, (edge, edgeNode) => {
      const nextNode = graph.edge[edgeNode.next];
      if (edgeNode.twin === undefined) {
        const candidates = twinMap.get(edgeNode.start);
        if (candidates === undefined) {
          throw Error('die');
        }
        // FIX: Assert one or zero twins?
        // Find the candidate that starts where we end.
        let count = 0;
        for (const candidate of candidates) {
          const candidateNode = graph.edge[candidate];
          if (candidateNode.start === nextNode.start) {
            count += 1;
            if (candidateNode.twin === undefined) {
              candidateNode.twin = edge;
              edge.twin = candidate;
            } else {
              duplicateEdgeCount += 1;
              // throw Error('die');
            }
          }
        }
        if (count > 1) {
          // console.log(`QQ/fromSolid/twins: multiple ${count} ${link.start} -> ${link.next.start}`);
        } else if (count === 0) {
          // console.log(`QQ/fromSolid/twins: none ${link.start} -> ${link.next.start} ${link.face.id}`);
        } else if (count === 1) {
          // console.log(`QQ/fromSolid/twins: one ${link.start} -> ${link.next.start} ${link.face.id} to ${link.twin.start} -> ${link.twin.next.start} ${link.twin.face.id}`);
        }
      }
    });
  });

  if (duplicateEdgeCount > 0) {
    console.log(`warning: duplicateEdgeCount = ${duplicateEdgeCount}`);
    // throw Error(`die: duplicateEdgeCount = ${duplicateEdgeCount}`);
  }

  let holeCount = 0;
  let edgeCount = 0;

  if (closed) {
    eachFace(graph, (face, faceNode) => {
      eachFaceEdge(graph, face, (edge, edgeNode) => {
        edgeCount += 1;
        if (edgeNode.twin === undefined) {
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
