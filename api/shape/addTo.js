import Shape from './Shape.js';

export const addTo = Shape.registerMethod(
  'addTo',
  (other) => (shape) => other.add(shape)
);
