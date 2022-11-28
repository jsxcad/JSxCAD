import Shape from './Shape.js';
import { toDisplayGeometry as op } from '@jsxcad/geometry';

export const toDisplayGeometry = Shape.registerMethod(
  'toDisplayGeometry',
  () => async (shape) => {
    return op(await shape.toGeometry());
  }
);
