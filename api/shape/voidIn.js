import Shape from './Shape.js';

export const voidIn = Shape.chainable(
  (other) => (shape) => Shape.toShape(other, shape).fitTo(shape.void())
);

Shape.registerMethod('voidIn', voidIn);
