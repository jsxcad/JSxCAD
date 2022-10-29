import Shape from './Shape.js';

export const test = Shape.chainable((value) => async (shape) => {
  console.log(`Test: ${value}`);
  return shape;
});

Shape.registerMethod('test', test);
