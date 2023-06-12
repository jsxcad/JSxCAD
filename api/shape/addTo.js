import Shape from './Shape.js';

export const addTo = Shape.registerMethod2(
  'addTo',
  ['input', 'shape'],
  (input, shape) => shape.add(input)
);
