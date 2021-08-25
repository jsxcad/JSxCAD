import Shape from './Shape.js';

export const cutFrom = (other) => (shape) =>
  Shape.toShape(other, shape).cut(shape);
Shape.registerMethod('cutFrom', cutFrom);
