import { Shape } from './Shape.js';
import { ghost } from './ghost.js';

export const drop = Shape.chainable(
  (selector) => (shape) => shape.on(selector, ghost())
);

Shape.registerMethod('drop', drop);
