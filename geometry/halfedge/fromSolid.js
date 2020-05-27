/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Point} Point
 * @typedef {import("./types").Solid} Solid
 */

import createEdge from './createEdge';
import eachLink from './eachLink';

let id = 0;

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
   * @returns {Array<Edge>}
   */
  const getTwins = (point) => {
    let twins = twinMap.get(point);
    if (twins === undefined) {
      twins = [];
      twinMap.set(point, twins);
    }
    return twins;
  };
  const loops = [];

  for (const surface of solid) {
    for (const path of surface) {
      let first;
      let last;
      for (let nth = 0; nth < path.length; nth++) {
        const thisPoint = normalize(path[nth]);
        const nextPoint = normalize(path[(nth + 1) % path.length]);
        const edge = createEdge(thisPoint);
        edge.id = id++;
        // nextPoint will be the start of the twin.
        getTwins(nextPoint).push(edge);
        if (first === undefined) {
          first = edge;
        }
        if (last !== undefined) {
          last.next = edge;
        }
        // Any arbitrary link will serve for face identity.
        edge.face = first;
        last = edge;
      }
      if (first === undefined) {
        throw Error(`die: ${JSON.stringify(path)}`);
      }
      // Close the loop.
      last.next = first;
      // And collect the closed loop.
      loops.push(first);
    }
  }

  // Bridge the edges.
  for (const loop of loops) {
    let link = loop;
    do {
      if (link.twin === undefined) {
        const candidates = twinMap.get(link.start);
        if (candidates === undefined) {
          throw Error('die');
        }
        // FIX: Assert one or zero twins?
        // Find the candidate that starts where we end.
        let count = 0;
        for (const candidate of candidates) {
          if (candidate.start === link.next.start) {
            count += 1;
            if (candidate.twin === undefined) {
              candidate.twin = link;
              link.twin = candidate;
            } else {
              throw Error('die');
            }
          }
        }
        if (count > 1) {
          // console.log(`QQ/fromSolid/twins: multiple ${link.start} -> ${link.next.start}`);
        } else if (count === 0) {
          // console.log(`QQ/fromSolid/twins: none ${link.start} -> ${link.next.start} ${link.face.id}`);
        } else if (count === 1) {
          // console.log(`QQ/fromSolid/twins: one ${link.start} -> ${link.next.start} ${link.face.id} to ${link.twin.start} -> ${link.twin.next.start} ${link.twin.face.id}`);
        }
      }
      link = link.next;
    } while (link !== loop);
  }

  let holeCount = 0;
  let edgeCount = 0;

  if (closed) {
    for (const loop of loops) {
      if (loop.face === undefined) continue;
      eachLink(loop,
               edge => {
                 edgeCount += 1;
                 if (edge.twin === undefined) {
                   // A hole in the 2-manifold.
                   holeCount += 1;
                 }
               });
    }
  }

  if (verbose && holeCount > 0) {
    console.log(`QQ/halfedge/fromSolid/holeCount: ${holeCount}`);
    console.log(`QQ/halfedge/fromSolid/edgeCount: ${edgeCount}`);
  }

  return loops;
};

export default fromSolid;
