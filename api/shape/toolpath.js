import Shape from './Shape.js';
import { computeToolpath } from '@jsxcad/geometry';

export const toolpath = Shape.registerMethod3(
  'toolpath',
  [
    'inputGeometry',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'geometry',
    'modes:simple',
  ],
  (
    geometry,
    toolSize = 2,
    resolution = toolSize,
    toolCutDepth = toolSize / 2,
    annealingMax,
    annealingMin,
    annealingDecay,
    target,
    modes
  ) =>
    computeToolpath(
      target,
      geometry,
      resolution,
      toolSize,
      toolCutDepth,
      annealingMax,
      annealingMin,
      annealingDecay,
      modes
    )
);
