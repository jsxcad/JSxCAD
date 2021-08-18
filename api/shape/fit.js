import Shape from './Shape.js';
import assemble from './assemble.js';

export const fit =
  (...shapes) =>
  (shape) =>
    assemble(...shapes, shape);

Shape.registerMethod('fit', fit);
