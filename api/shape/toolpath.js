import Edges from './Edges.js';
import Group from './Group.js';
import Points from './Points.js';
import Shape from './Shape.js';
import { computeToolpath } from '@jsxcad/geometry';

const lerp = (t, [ax, ay, az], [bx, by, bz]) => [
  ax + t * (bx - ax),
  ay + t * (by - ay),
  az + t * (bz - az),
];

export const toolpath =
  ({
    diameter = 1,
    jumpHeight = 1,
    stepCost = diameter * -2,
    turnCost = -2,
    neighborCost = -2,
    stopCost = 30,
    candidateLimit = 1,
    subCandidateLimit = 1,
  } = {}) =>
  (shape) => {
    const toolpath = computeToolpath(shape.toGeometry(), {
      diameter,
      jumpHeight,
      stepCost,
      turnCost,
      neighborCost,
      stopCost,
      candidateLimit,
      subCandidateLimit,
    });
    const cuts = [];
    const jumpEnds = [];
    const cutEnds = [];
    const jumps = [];
    // console.log(JSON.stringify(shape));
    // console.log(JSON.stringify(toolpath));
    for (const { op, from, to } of toolpath.toolpath) {
      switch (op) {
        case 'cut':
          cuts.push([lerp(0.2, from, to), to]);
          cutEnds.push(to);
          break;
        case 'jump':
          jumps.push([lerp(0.2, from, to), to]);
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
