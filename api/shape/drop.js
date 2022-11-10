import { Shape } from './Shape.js';
import { ghost } from './ghost.js';
import { on } from './on.js';

export const drop = Shape.registerMethod(
  'drop',
  (selector) => async (shape) => on(selector, ghost())(await shape)
);
