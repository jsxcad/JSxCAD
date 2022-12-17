import Shape from './Shape.js';
import { unfold as unfoldGeometry } from '@jsxcad/geometry';

export const unfold = Shape.registerMethod(
  'unfold',
  () => async (shape) =>
    Shape.fromGeometry(unfoldGeometry(await shape.toGeometry()))
);
