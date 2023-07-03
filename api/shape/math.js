import Shape from './Shape.js';

// These should probably be polymorphic and handle vector operations, etc.

// e.g., a.x(times(diameter(), 1/2))
export const times = Shape.registerMethod2('times', ['numbers'], (numbers) =>
  numbers.reduce((a, b) => a * b, 1)
);

// e.g., a.x(plus(diameter(), -2))
export const plus = Shape.registerMethod2('plus', ['numbers'], (numbers) =>
  numbers.reduce((a, b) => a + b, 0)
);
