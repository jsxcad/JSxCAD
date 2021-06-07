import { ChainedHull, Group } from '@jsxcad/api-v1-shapes';
import { Shape, orient } from '@jsxcad/api-v1-shape';
import { add, normalize, subtract } from '@jsxcad/math-vec3';
import { getPathEdges, outline } from '@jsxcad/geometry';

import { fromNormalAndPoint } from '@jsxcad/math-plane';

const START = 0;
const END = 1;

const planeOfBisection = (aStart, bStart, intersection) => {
  const dA = normalize(subtract(aStart, intersection));
  const dB = normalize(subtract(bStart, intersection));
  const bis1 = add(dA, dB);
  // const bis2 = subtract(dA, dB);
  // return fromNormalAndPoint(bis2, intersection);
  return fromNormalAndPoint(bis1, intersection);
};

// FIX: segments can produce overlapping tools.
export const sweep = (toolpath, tool, up = [0, 0, 1, 0]) => {
  const chains = [];
  for (const { paths } of outline(toolpath.toKeptGeometry())) {
    for (const path of paths) {
      // FIX: Handle open paths and bent polygons.
      const tools = [];
      const edges = getPathEdges(path);
      const up = [0, 0, 1, 0];
      const length = edges.length;
      for (let nth = 0; nth < length + 1; nth++) {
        const prev = edges[nth % length];
        const curr = edges[(nth + 1) % length];
        const next = edges[(nth + 2) % length];
        // We are going to sweep from a to b.
        const a = planeOfBisection(prev[START], curr[END], prev[END]);
        const b = planeOfBisection(curr[START], next[END], curr[END]);
        const right = a;
        const p = prev[END];
        tools.push(
          orient(p, add(p, up), add(p, right), tool).projectToPlane(b, a)
        );
      }
      chains.push(ChainedHull(...tools));
    }
  }
  return Group(...chains);
};

const sweepMethod = function (tool, up) {
  return sweep(this, tool, up);
};

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool, up) {
  return this.with(sweep(this, tool, up));
};

export default sweep;
