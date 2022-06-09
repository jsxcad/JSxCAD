import Shape from './Shape.js';

export const cutFrom = Shape.chainable(
  (other) => (shape) => Shape.toShape(other, shape).cut(shape)
);

Shape.registerMethod('cutFrom', cutFrom);
