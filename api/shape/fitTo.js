import Shape from './Shape.js';
import assemble from './assemble.js';

export const fitTo =
  (...shapes) =>
  (shape) =>
    assemble(shape, ...shapes.map((other) => Shape.toShape(other, shape)));

Shape.registerMethod('fitTo', fitTo);
