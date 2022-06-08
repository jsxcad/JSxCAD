import { Shape } from './Shape.js';

export const clipfrom = Shape.chainable(
  (other) => (shape) => other.clip(shape)
);
Shape.registerMethod('clipFrom', clipfrom);
