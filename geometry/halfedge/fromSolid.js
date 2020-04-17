import createEdge from './createEdge';
import getEdges from './getEdges';
// This produces a half-edge mesh.

let id = 0;

export const fromSolid = (solid, normalize, closed = true) => {
  const twinMap = new Map();
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
        const twins = twinMap.get(nextPoint);
        if (twins === undefined) {
          twinMap.set(nextPoint, [edge]);
        } else {
          twins.push(edge);
        }
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
        for (const candidate of candidates) {
          if (candidate.start === link.next.start) {
            if (candidate.twin === undefined) {
              candidate.twin = link;
              link.twin = candidate;
            } else {
              // console.log(`QQ/twin: ${JSON.stringify(toPolygons([candidate.twin]))}`);
              // console.log(`QQ/candidate: ${JSON.stringify(toPolygons([candidate]))}`);
              // console.log(`QQ/link: ${JSON.stringify(toPolygons([link]))}`);
              // throw Error('die');
              for (const edge of getEdges(link)) {
                edge.face = undefined;
              }
            }
            break;
          }
        }
      }
      link = link.next;
    } while (link !== loop);
  }

  if (closed) {
    for (const loop of loops) {
      for (const edge of getEdges(loop)) {
        if (edge.twin === undefined) {
          // A hole in the 2-manifold.
          throw Error('die');
        }
      }
    }
  }

  return loops;
};

export default fromSolid;
