import Shape from './Shape.js';

// These should probably be polymorphic and handle vector operations, etc.

// e.g., a.x(times(diameter(), 1/2))
export const times = Shape.registerMethod3(
  'times',
  ['numbers'],
  (numbers) => numbers.reduce((a, b) => a * b, 1),
  (value) => value
);

// e.g., a.x(plus(diameter(), -2))
export const plus = Shape.registerMethod3(
  'plus',
  ['numbers'],
  (numbers) => numbers.reduce((a, b) => a + b, 0),
  (value) => value
);
