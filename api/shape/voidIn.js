import Shape from './Shape.js';

export const voidIn = (other) => (shape) =>
  Shape.toShape(other, shape).fitTo(shape.void());

Shape.registerMethod('voidIn', voidIn);
