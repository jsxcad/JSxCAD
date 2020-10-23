import { Shape, orient } from '@jsxcad/api-v1-shape';
import { add, cross, dot, normalize, scale, subtract, transform } from '@jsxcad/math-vec3';
import { fromRotation } from '@jsxcad/math-mat4';

import { Group } from '@jsxcad/api-v1-shapes';
// import { Hull } from './Hull.js';
import { fromNormalAndPoint, fromPoints } from '@jsxcad/math-plane';
import { getEdges } from '@jsxcad/geometry-path';
import { getPaths } from '@jsxcad/geometry-tagged';

const START = 0;
const END = 1;

const planeOfBisection = (aStart, bStart, intersection) => {
  const dA = normalize(subtract(aStart, intersection));
  const dB = normalize(subtract(bStart, intersection));
  const bis1 = add(dA, dB);
  const bis2 = subtract(dA, dB);
console.log(`QQ/bis1: ${JSON.stringify(bis1)}`);
console.log(`QQ/bis2: ${JSON.stringify(bis2)}`);
console.log(`QQ/intersection: ${JSON.stringify(intersection)}`);
  return fromNormalAndPoint(bis2, intersection);
};

const X = 0;
const Y = 1;
const Z = 2;

const toward = (shape, eye, center, up) => {
  const f = normalize(subtract(center, eye));
  const u1 = normalize(up);
  const s = normalize(cross(f, u1));
  const u = cross(s, f);
  const matrix = [
    s[X], s[Y], s[Z], -dot(s, eye),
    u[X], u[Y], u[Z], -dot(u, eye),
    -f[X], -f[Y], -f[Z], dot(f, eye),
    0, 0, 0, 0];
  return shape.transform(matrix);
};

// FIX: This is a weak approximation assuming a 1d profile -- it will need to be redesigned.
export const sweep = (toolpath, tool) => {
  const chains = [];
  for (const { paths } of getPaths(toolpath.toKeptGeometry())) {
    for (const path of paths) {
      const edges = getEdges(path);
      const length = edges.length;
      for (let nth = 0; nth < length; nth++) {
        const prev = edges[nth];
        const curr = edges[(nth + 1) % length];
        const next = edges[(nth + 2) % length];
        const a = planeOfBisection(prev[START], curr[END], curr[START]);
        const b = planeOfBisection(curr[START], next[END], curr[END]);
        const middle = scale(0.5, add(curr[START], curr[END]));
        const plane = fromPoints(prev[START], curr[START], curr[END]);
        const rotate90 = fromRotation(Math.PI / -2, plane);
        const direction = normalize(subtract(curr[START], curr[END]));
        const rightDirection = transform(rotate90, direction);
        const right = add(middle, rightDirection);
console.log(`QQ/rightDirection: ${rightDirection}`);
        // chains.push(tool.orient({ from: scale(0.5, add(curr[START], curr[END])), at: curr[END] }).extrudeToPlane(a, b));
        // chains.push(toward(tool, middle, curr[END], [0, 0.5, 0.5]));
        // chains.push(orient(middle, add(middle, plane), right, tool).extrudeToPlane(a, b));
        chains.push(orient(middle, add(middle, plane), right, tool).extrudeToPlane(a, b));
      }
      // FIX: Handle tool rotation around the vector of orientation, and corners.
/*
      chains.push(
        ...getEdges(path).map(([start, end]) =>
          tool.orient({ from: start, at: end }).extrude(distance(start, end))
        )
      );
*/
    }
  }
  return Group(...chains);
};

const sweepMethod = function (tool, { resolution = 1 } = {}) {
  return sweep(this, tool, { resolution });
};

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool, { resolution }) {
  return this.with(sweep(this, tool, { resolution }));
};

export default sweep;
