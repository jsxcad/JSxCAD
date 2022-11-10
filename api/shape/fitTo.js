import Shape from './Shape.js';
import assemble from './assemble.js';
import { destructure } from './destructure.js';

export const fitTo = Shape.registerMethod('fitTo', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return async (shape) =>
    assemble(
      modes,
      shape,
      ...await shape.toShapes(shapes)
    );
});
