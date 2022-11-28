import Shape from './Shape.js';
import { noGhost } from '@jsxcad/geometry';

export const clean = Shape.registerMethod(
  'clean',
  () => async (shape) => Shape.fromGeometry(noGhost(await shape.toGeometry()))
);
