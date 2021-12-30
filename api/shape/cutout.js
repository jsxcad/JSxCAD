import Shape from './Shape.js';

export const cutout =
  (other, op = (clipped) => clipped.void()) =>
  (shape) => {
    other = Shape.toShape(other, shape);
    return shape.cut(other).and(op(shape.clip(other)));
  };
Shape.registerMethod('cutout', cutout);
