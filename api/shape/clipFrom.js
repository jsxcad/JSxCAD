import { Shape } from './Shape.js';

export const clipFrom = Shape.registerMethod(
  'clipFrom',
  (other) => (shape) => other.clip(shape)
);
