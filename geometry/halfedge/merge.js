// Note that merging produces duplicate points.

import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
import { toPlane } from './toPlane';

const merged = Symbol('merged');

export const merge = (loops) => {
  const walk = (loop) => {
    console.log(`QQ/walk/loop: ${loop.start}`);
    if (loop[merged] || loop.next === undefined) return;
    eachLink(loop, link => { link[merged] = true; console.log(link.start); });
    let link = loop;
    do {
      console.log(`QQ/walk/link: ${link.start}`);
      if (link.twin) {
        const twin = link.twin;
        console.log(`QQ/walk/twin: ${link.twin.start}`);
        if (twin.twin !== link) throw Error('die');
        const linkPlane = toPlane(link);
        const twinPlane = toPlane(twin);
        if (equalsPlane(linkPlane, twinPlane)) {
          const linkNext = link.next;
          const twinNext = twin.next;
          const selfLinkage = (link.face === twin.face);
          const spurLinkage = (twin === linkNext);
          loop = link;
          if (linkNext.dead) throw Error('die');
          if (twinNext.dead) throw Error('die');
          link.twin = undefined;
          Object.assign(link, twinNext);
          if (!spurLinkage) {
            twin.twin = undefined;
            Object.assign(twin, linkNext);
          }
          if (link.twin) { link.twin.twin = link; }
          if (twin.twin) { twin.twin.twin = twin; }
          if (twin.next === twin) throw Error('die');
          linkNext.next = undefined;
          linkNext.twin = undefined;
          linkNext.dead = true;
          if (!spurLinkage) {
            twinNext.next = undefined;
            twinNext.twin = undefined;
            twinNext.dead = true;
          }
          if (spurLinkage) {
            // No more to do -- the half-linkage above was sufficient. Carry on.
          } else if (selfLinkage) {
            // One loop was merged with itself, producing a hole.
            twin.face = undefined;
            eachLink(link, edge => { edge.face = link.face; });

            const holes = link.face.holes || [];
            // The loop was split into a ring with an island inside.
            // But we're not sure which loop is which or which side the loop face ended up on.
            // Elect new faces.
            eachLink(link, edge => { edge.face = link; });
            eachLink(twin, edge => { edge.face = twin; });
            const newLinkPlane = toPlane(link, /* recompute= */true);
            const newTwinPlane = toPlane(twin, /* recompute= */true);
            // Extend and assign the holes.
            if (equalsPlane(linkPlane, newLinkPlane)) {
              // The twin loop is the island.
              if (equalsPlane(linkPlane, newTwinPlane)) {
                throw Error('die');
              }
              holes.push(twin);
              link.holes = holes;
              twin.holes = undefined;
            } else {
              // The link loop is the island.
              if (equalsPlane(linkPlane, newLinkPlane)) {
                throw Error('die');
              }
              holes.push(link);
              twin.holes = holes;
              link.holes = undefined;
            }
          } else {
            // Two separate loops were merged, update face affinity.
            link.plane = undefined;
            eachLink(link, edge => { edge.face = link; });
          }
        }
      }
      if (link.next === undefined) { throw Error('die'); }
      link = link.next;
    } while (link !== loop);
    eachLink(loop, link => { if (link.twin) { walk(link.twin); } });
    return loop;
  };
  return loops.map(walk).filter(loop => loop && loop.next);
};

export default merge;
