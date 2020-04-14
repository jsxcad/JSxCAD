import { equals } from '@jsxcad/math-vec3';
import getEdges from './getEdges';
import previousEdge from './previousEdge';
import toDot from './toDot';

// Note that merging produces duplicate points.

export const merge = (loops, noIslands = false) => {
  const merged = [];
  const faces = new Set();
  const skip = new Set();
  let done = false;
  for (let loop of loops) {
    let link = loop;
    do {
      if (link.twin !== undefined && (noIslands == false || link.face !== link.twin.face)) {
        // Linking a face to itself is the only way to produce a new island.

        // Edge collapse produces a duplicate in order to preserve twin edge identity.
        const twin = link.twin;
        if (twin.start !== link.next.start) {
          throw Error('die');
        }
        if (twin.next.start !== link.start) {
          throw Error('die');
        }
        const linkNext = link.next;
        const twinNext = twin.next;
        link.next = twinNext;
        twin.next = linkNext;
        // The collapsed edges do not have twins.
        link.twin = undefined;
        twin.twin = undefined;
        // Make sure that the face stays coherent.
        loop = link;
        done = true;
        if (link.start !== link.next.start) {
          throw Error('die');
        }
        if (twin.start !== twin.next.start) {
          throw Error('die');
        }
      }
      // Ensure face coherence.
      link.next.face = link.face;
      link = link.next;
    } while (link !== loop);
    if (!faces.has(loop.face)) {
      faces.add(loop.face);
      merged.push(loop);
    }
  }
  return merged;
}

export default merge;
