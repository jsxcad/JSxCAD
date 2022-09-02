import Shape from './Shape.js';
import assemble from './assemble.js';
import { destructure } from './destructure.js';

export const fitTo = Shape.chainable((...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return (shape) =>
    assemble(
      modes,
      shape,
      ...shapes.map((other) => Shape.toShape(other, shape))
    );
});

Shape.registerMethod('fitTo', fitTo);
