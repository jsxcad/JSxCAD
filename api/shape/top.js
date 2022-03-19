import Shape from './Shape.js';

const Z = 2;

export const top = () => (shape) =>
  shape.size(
    ({ max }) =>
      (shape) =>
        max[Z]
  );

Shape.registerMethod('top', top);
