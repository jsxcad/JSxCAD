import Shape from './Shape.js';
import assemble from './assemble.js';

export const fit = Shape.chainable(
  (...shapes) =>
    (shape) =>
      assemble(...shapes.map((other) => Shape.toShape(other, shape)), shape)
);

Shape.registerMethod('fit', fit);
