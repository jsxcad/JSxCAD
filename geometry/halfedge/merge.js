// Note that merging produces duplicate points.

import { equalsPlane } from './junction';
import { equals as equalsVec3 } from '@jsxcad/math-vec3';
import { toPlane } from './toPlane';
import { toDot } from './toDot';

export const merge = (loops, noIslands = false, selectJunction = (_ => false)) => {
  console.log(`QQ/merge/dot: ${toDot(loops)}`);
  const merged = [];
  const faces = new Set();
  for (let loop of loops) {
    if (loop.face === undefined) continue;
    let link = loop;
    do {
      const v = equalsVec3(link.start, [5.01,5.01,10]) || equalsVec3(link.start, [5.01,-5.01,10]);
if (v) console.log(`------------------`);
if (v) console.log(`QQ/merge/link/dot: ${toDot([link])}`);
if (v) console.log(`QQ/link: ${link.start} -> ${link.next.start}`);
      if (link.twin !== undefined && link.twin.face !== undefined) {
if (v) console.log(`QQ/twin/yes`);
        if (noIslands === false || link.face !== link.twin.face) {
if (v) console.log(`QQ/plane/link: ${toPlane(link, true)}, twin: ${toPlane(link.twin, true)}`);
          if (equalsPlane(toPlane(link), toPlane(link.twin))) {
if (v) console.log(`QQ/plane/yes`);
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
            if (link.start !== link.next.start) {
              throw Error('die');
            }
            if (twin.start !== twin.next.start) {
              throw Error('die');
            }
          }
        }
      }
      // Ensure face coherence.
      link.next.face = link.face;
      link = link.next;
    } while (link !== loop);
    if (loop.face !== undefined && !faces.has(loop.face)) {
      faces.add(loop.face);
      merged.push(loop);
    }
  }
  return merged;
};

export default merge;
