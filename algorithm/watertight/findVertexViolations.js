import { equals, length, subtract } from "@jsxcad/math-vec3";

import { ensureMapElement } from "./ensureMapElement";
import { fromPoints } from "@jsxcad/math-ray3";

const toIdentity = JSON.stringify;

/**
 * findVertexViolations determines that the vertex's edges are closed.
 *
 * For a watertight vertex, it will consist of unique lines with an even count.
 *
 * @params {start} start - the vertex.
 * @params {Array<point>} ends - the sorted other end of each edge.
 * @returns {Array} violations.
 *
 * Note that checking for pairs of edges isn't sufficient.
 *
 *    A-----B
 *    |     |
 *    |     E--F
 *    |     |  |
 *    C-----D--G
 *
 * A situation with B~D, D~B, E~D, D~E would lead such an algorithm to believe
 * the vertex was watertight when it is only partially watertight.
 *
 * So, we need to detect any distinct colinear edges.
 */
export const findVertexViolations = (start, ...ends) => {
  const lines = new Map();
  ends.forEach((end) => {
    // These are not actually lines, but they all start at the same position, so we can pretend.
    const ray = fromPoints(start, end);
    ensureMapElement(lines, toIdentity(ray)).push(end);
  });

  const distance = (end) => length(subtract(end, start));

  let violations = [];
  lines.forEach((ends) => {
    ends.sort((a, b) => distance(a) - distance(b));
    for (let nth = 1; nth < ends.length; nth++) {
      if (!equals(ends[nth], ends[nth - 1])) {
        violations.push(["unequal", [start, ...ends]]);
        violations.push(["unequal", [start, ...ends].reverse()]);
        break;
      }
    }
    if (ends.length % 2 !== 0) {
      // Lines aren't paired
      // notWatertight = true
      // violations.push(['unpaired', [start, ...ends]])
      // return
      // break
    }
  });

  // If no violations, it is Watertight.
  return violations;
};
