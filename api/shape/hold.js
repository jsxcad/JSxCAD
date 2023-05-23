import { Shape } from './Shape.js';
import { inFn } from './in.js';

export const hold = Shape.registerMethod2(
  'hold',
  ['inputShape', 'shapes'],
  (inputShape, shapes) => inputShape.on(inFn(), inFn().and(...shapes))
);
