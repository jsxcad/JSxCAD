import { Shape, orient } from '@jsxcad/api-v1-shape';
import { add, normalize, scale, subtract, transform } from '@jsxcad/math-vec3';

import { Group } from '@jsxcad/api-v1-shapes';
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

// CHECK: Not clear why we need to negate the dispacement.
const neg = ([a, b, c, d]) => [a, b, c, -d];

// FIX: This is a weak approximation assuming a 1d profile -- it will need to be redesigned.
export const sweep = (toolpath, tool, up = [0, 0, 1, 0]) => {
  const chains = [];
  for (const { paths } of getPaths(toolpath.toKeptGeometry())) {
    for (const path of paths) {
      // FIX: Handle open paths and bent polygons.
      const edges = getEdges(path);
      // const up = [0, 0, 1, 0]; // fromPolygon(path);
      const length = edges.length;
      for (let nth = 0; nth < length; nth++) {
        const prev = edges[nth];
        const curr = edges[(nth + 1) % length];
        const next = edges[(nth + 2) % length];
        const a = planeOfBisection(prev[START], curr[END], curr[START]);
        const b = planeOfBisection(curr[START], next[END], curr[END]);
        const middle = scale(0.5, add(curr[START], curr[END]));
        const rotate90 = fromRotation(Math.PI / -2, up);
        const direction = normalize(subtract(curr[START], curr[END]));
        const rightDirection = transform(rotate90, direction);
        const right = add(middle, rightDirection);
        chains.push(
          orient(middle, add(middle, up), right, tool).extrudeToPlane(
            neg(b),
            neg(a)
          )
        );
      }
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
