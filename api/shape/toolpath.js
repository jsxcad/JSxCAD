import {
  computeToolpath,
  measureBoundingBox,
  taggedGroup,
} from '@jsxcad/geometry';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

const Z = 2;

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
        feedrate,
        speed,
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
      const toolpaths = [];
      for (let z = max[Z]; z >= min[Z]; z -= layerHeight) {
        const toolpath = computeToolpath(geometry, {
          speed,
          feedrate,
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
      }
      return Shape.fromGeometry(taggedGroup({}, ...toolpaths));
    }
);
