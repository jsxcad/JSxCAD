import { Shape } from './Shape.js';
import { ghost } from './ghost.js';
import { on } from './on.js';

export const drop = Shape.registerMethod2(
  'drop',
  ['input', 'shape'],
  (input, selector) => on(selector, ghost())(input)
);
