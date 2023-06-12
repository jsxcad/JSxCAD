import Shape from './Shape.js';
import { computeToolpath } from '@jsxcad/geometry';

export const toolpath = Shape.registerMethod2(
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
  ],
  (
    geometry,
    toolSize = 2,
    resolution = toolSize,
    toolCutDepth = toolSize / 2,
    annealingMax,
    annealingMin,
    annealingDecay,
    target
  ) =>
    Shape.fromGeometry(
      computeToolpath(
        target,
        geometry,
        resolution,
        toolSize,
        toolCutDepth,
        annealingMax,
        annealingMin,
        annealingDecay
      )
    )
);
