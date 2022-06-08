import Shape from './Shape.js';

export const cutout = Shape.chainable(
  (other, op = (cut) => (clipped) => cut.and(clipped.void())) =>
    (shape) => {
      other = Shape.toShape(other, shape);
      return shape.cut(other).op((cut) => op(cut)(shape.clip(other)));
    }
);
Shape.registerMethod('cutout', cutout);
