import Shape from './Shape.js';

export const cutfrom = (other) => (shape) =>
  Shape.toShape(other, shape).cut(shape);

Shape.registerMethod('cutfrom', cutfrom);
