import Shape from './Shape.js';
import assemble from './assemble.js';
import { destructure } from './destructure.js';

export const fit = Shape.chainable((...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return (shape) =>
    assemble(
      modes,
      ...shapes.map((other) => Shape.toShape(other, shape)),
      shape
    );
});

Shape.registerMethod('fit', fit);
