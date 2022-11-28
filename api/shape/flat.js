import Shape from './Shape.js';
import { XY } from './refs.js';
import { to } from './to.js';

export const flat = Shape.registerMethod(
  'flat',
  () => async (shape) => to(XY())(shape)
);
