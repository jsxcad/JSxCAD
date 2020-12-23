import { ChainedHull, Group } from '@jsxcad/api-v1-shapes';
import { Shape, orient } from '@jsxcad/api-v1-shape';
import { add, normalize, subtract, transform } from '@jsxcad/math-vec3';

import { fromNormalAndPoint } from '@jsxcad/math-plane';
import { fromRotation } from '@jsxcad/math-mat4';
import { getEdges } from '@jsxcad/geometry-path';
import { getPaths } from '@jsxcad/geometry-tagged';

const START = 0;
const END = 1;

const planeOfBisection = (aStart, bStart, intersection) => {
  const dA = normalize(subtract(aStart, intersection));
  const dB = normalize(subtract(bStart, intersection));
  const bis2 = subtract(dA, dB);
  return fromNormalAndPoint(bis2, intersection);
};

// FIX: There is something very wrong with this -- rotating the profile around z can produce inversion.
export const sweep = (toolpath, tool, up = [0, 0, 1, 0]) => {
  const chains = [];
  for (const { paths } of getPaths(toolpath.toKeptGeometry())) {
    for (const path of paths) {
      // FIX: Handle open paths and bent polygons.
      const tools = [];
      const edges = getEdges(path);
      // const up = [0, 0, 1, 0]; // fromPolygon(path);
      const length = edges.length;
      for (let nth = 0; nth < length - 1; nth++) {
        const prev = edges[nth];
        const curr = edges[(nth + 1) % length];
        const a = planeOfBisection(prev[START], curr[END], curr[START]);
        const rotate90 = fromRotation(Math.PI / -2, up);
        const direction = normalize(subtract(curr[START], curr[END]));
        const right = transform(rotate90, direction);
        const p = curr[START];
        tools.push(
          orient(p, add(p, up), add(p, right), tool).projectToPlane(
            a,
            direction
          )
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
