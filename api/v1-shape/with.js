import Shape from './Shape.js';
import assemble from './assemble.js';

export const withFn =
  (...shapes) =>
  (shape) =>
    assemble(shape, ...shapes);

Shape.registerMethod('with', withFn);
