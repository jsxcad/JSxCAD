/**
 * @typedef {import("./types").Loops} Loops
 */

import eachLink from "./eachLink";

/**
 * toDot
 *
 * @function
 * @param {Loops} loops
 * @returns {string}
 */
export const toDot = (loops, { doTwin = true, doHoles = true } = {}) => {
  const out = [];
  out.push(`digraph {`);
  for (const loop of loops) {
    out.push(`  subgraph cluster_${loop.id} {`);
    eachLink(loop, (edge) => {
      const [x, y, z] = edge.start;
      out.push(`    ${edge.id} [pos = "${x},${y},${z}!"];`);
    });
    out.push(`  }`);
  }
  for (const loop of loops) {
    const face = loop.face;
    eachLink(loop, (edge) => {
      out.push(`  ${edge.id} -> ${edge.next.id};`);
      if (doTwin && edge.twin) {
        out.push(`  ${edge.id} -> ${edge.twin.id} [style="dotted"];`);
      }
      if (doHoles && edge.holes) {
        out.push(`  ${edge.id} -> "hole" [style="dashed"];`);
      }
      if (edge === edge.face) {
        out.push(`  ${edge.id} -> "face" [style="dashed"];`);
      }
    });
    if (doHoles && face.holes) {
      for (const hole of face.holes) {
        out.push(`  ${face.id} -> ${hole.id} [style="dashed"];`);
      }
    }
  }
  out.push(`}`);
  return out.join("\n");
};

export default toDot;
