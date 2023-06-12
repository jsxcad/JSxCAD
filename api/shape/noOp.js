import Shape from './Shape.js';

export const noOp = Shape.registerMethod2('noOp', ['input'], (input) => input);

export const value = Shape.registerMethod2(
  'value',
  ['value'],
  (value) => value
);
