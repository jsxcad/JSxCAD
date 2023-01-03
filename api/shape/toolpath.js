import {
  computeToolpath,
  measureBoundingBox,
  taggedGroup,
} from '@jsxcad/geometry';
// import Edges from './Edges.js';
// import Group from './Group.js';
// import Points from './Points.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

const Z = 2;

/*
const lerp = (t, [ax, ay, az], [bx, by, bz]) => [
  ax + t * (bx - ax),
  ay + t * (by - ay),
  az + t * (bz - az),
];
*/

export const toolpath = Shape.registerMethod(
  'toolpath',
  (...args) =>
    async (shape) => {
      const [toolDiameter = 1, options] = await destructure2(
        shape,
        args,
        'number',
        'options'
      );
      const {
        jumpHeight = 1,
        stepCost = toolDiameter * -2,
        turnCost = -2,
        neighborCost = -2,
        stopCost = 30,
        candidateLimit = 1,
        subCandidateLimit = 1,
        layerHeight = 1,
      } = options;
      const geometry = await shape.toGeometry();
      const bounds = measureBoundingBox(geometry);
      const [min, max] = bounds;
      // const cuts = [];
      // const jumpEnds = [];
      // const cutEnds = [];
      // const jumps = [];
      const toolpaths = [];
      for (let z = max[Z]; z >= min[Z]; z -= layerHeight) {
        const toolpath = computeToolpath(geometry, {
          toolDiameter,
          jumpHeight,
          stepCost,
          turnCost,
          neighborCost,
          stopCost,
          candidateLimit,
          subCandidateLimit,
          z,
        });
        toolpaths.push(toolpath);
        /*
        for (const step of toolpath.toolpath) {
          steps.push(step);
        }
        // Raise tool.
        steps.push({ op: 'jump', to: [undefined, undefined] });
        // Move back to the origin.
        steps.push({ op: 'jump', to: [0, 0] });
        for (const { op, from, to } of toolpath.toolpath) {
          if (!from.every(isFinite)) {
            // This is from an unknown position.
            continue;
          }
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
        */
      }
      /*
      return Group(
        // Points(cutEnds).color('red').tag('toolpath:preview/cutEnds'),
        // Edges(cuts).color('red').tag('toolpath:preview/cutEdges'),
        // Points(jumpEnds).color('blue').tag('toolpath:preview/jumpEnds'),
        // Edges(jumps).color('blue').tag('toolpath:preview/jumpEdges'),
        Shape.fromGeometry({ type: 'toolpath', tags: ['type:toolpath'], toolpath: steps })
      );
      */
      return Shape.fromGeometry(taggedGroup({}, ...toolpaths));
    }
);
