import Shape from './Shape.js';

const Z = 2;

export const top = Shape.chainable(
  () => (shape) =>
    shape.size(
      ({ max }) =>
        (shape) =>
          max[Z]
    )
);

Shape.registerMethod('top', top);
