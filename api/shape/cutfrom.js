import Shape from './Shape.js';

export const cutfrom = Shape.chainable(
  (other) => (shape) => Shape.toShape(other, shape).cut(shape)
);

Shape.registerMethod('cutfrom', cutfrom);
