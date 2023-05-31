import { Shape } from './Shape.js';

export const clipFrom = Shape.registerMethod2(
  'clipFrom',
  ['input', 'shape', 'modes'],
  (input, shape, modes) => shape.clip(input, ...modes)
);
