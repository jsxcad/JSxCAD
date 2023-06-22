import Shape from './Shape.js';

export const self = Shape.registerMethod2(
  ['input', 'self'],
  ['input'],
  (input) => input
);

export const input = self;
