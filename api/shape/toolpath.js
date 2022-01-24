import Edges from './Edges.js';
import Group from './Group.js';
import Points from './Points.js';
import Shape from './Shape.js';
import { computeToolpath } from '@jsxcad/geometry';
import { lerp } from '@jsxcad/math-vec3';

export const toolpath =
  ({ diameter = 1, jumpHeight = 1 } = {}) =>
  (shape) => {
    const toolpath = computeToolpath(shape.toGeometry(), diameter, jumpHeight);
    const cuts = [];
    const jumpEnds = [];
    const cutEnds = [];
    const jumps = [];
    for (const { op, from, to } of toolpath.toolpath) {
      switch (op) {
        case 'cut':
          cuts.push([from, lerp(0.8, from, to)]);
          cutEnds.push(to);
          break;
        case 'jump':
          jumps.push([from, lerp(0.8, from, to)]);
          jumpEnds.push(to);
          break;
      }
    }
    return Group(
      Points(cutEnds).color('red'),
      Edges(cuts).color('red'),
      Points(jumpEnds).color('blue'),
      Edges(jumps).color('blue'),
      Shape.fromGeometry(toolpath)
    );
  };

Shape.registerMethod('toolpath', toolpath);
