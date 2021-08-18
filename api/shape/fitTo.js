import Shape from './Shape.js';
import assemble from './assemble.js';

export const fitTo =
  (...shapes) =>
  (shape) =>
    assemble(shape, ...shapes);

Shape.registerMethod('fitTo', fitTo);
