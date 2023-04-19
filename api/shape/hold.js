import { Shape } from './Shape.js';
import { inFn } from './in.js';

export const hold = Shape.registerMethod2(
  'hold',
  ['shapes'],
  (shapes) => async (shape) => shape.on(inFn(), inFn().and(...shapes))
);
