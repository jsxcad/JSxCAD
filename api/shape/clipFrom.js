import { Shape } from './Shape.js';

export const clipFrom = Shape.chainable(
  (other) => (shape) => other.clip(shape)
);
Shape.registerMethod('clipFrom', clipFrom);
