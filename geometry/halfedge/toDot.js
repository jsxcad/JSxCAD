/** @module @jsxcad/geometry-halfedge/toDot */

/**
 * @typedef {import("./types").Loops} Loops
 */

import eachLink from './eachLink';

/**
 * toDot
 *
 * @function
 * @param {Loops} loops
 * @returns {string}
 */
export const toDot = (loops, { doTwin = true } = {}) => {
  const out = [];
  out.push(`digraph {`);
  for (const loop of loops) {
    out.push(`  subgraph cluster_${loop.id} {`);
    eachLink(loop,
             edge => {
               const [x, y, z] = edge.start;
               out.push(`    ${edge.id} [pos = "${x},${y},${z}!"];`);
             });
    out.push(`  }`);
  }
  for (const loop of loops) {
    eachLink(loop,
             edge => {
               out.push(`  ${edge.id} -> ${edge.next.id};`);
               if (doTwin && edge.twin) {
                 out.push(`  ${edge.id} -> ${edge.twin.id} [style="dotted"];`);
               }
             });
  }
  out.push(`}`);
  return out.join('\n');
};

export default toDot;
