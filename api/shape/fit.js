import Shape from './Shape.js';
import assemble from './assemble.js';
import { destructure } from './destructure.js';

export const fit = Shape.registerMethod('fit', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return (shape) =>
    assemble(
      modes,
      ...shapes.map((other) => Shape.toShape(other, shape)),
      shape
    );
});
