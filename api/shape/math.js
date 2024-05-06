import Shape from './Shape.js';

// These should probably be polymorphic and handle vector operations, etc.

export const acos = Shape.registerMethod3(
  'acos',
  ['number'],
  (number) => Math.acos(number) / (Math.PI * 2),
  (value) => value
);

export const cos = Shape.registerMethod3(
  'cos',
  ['number'],
  (number) => Math.cos(number * Math.PI * 2),
  (value) => value
);

export const lerp = Shape.registerMethod3(
  'lerp',
  ['number', 'number', 'number'],
  (min, max, position) => position * (max - min) + min,
  (value) => value
);

export const max = Shape.registerMethod3(
  'max',
  ['numbers'],
  (numbers) => Math.max(...numbers),
  (value) => value
);

export const min = Shape.registerMethod3(
  'min',
  ['numbers'],
  (numbers) => Math.min(...numbers),
  (value) => value
);

// e.g., a.x(plus(diameter(), -2))
export const plus = Shape.registerMethod3(
  'plus',
  ['numbers'],
  (numbers) => numbers.reduce((a, b) => a + b, 0),
  (value) => value
);

// e.g., a.x(times(diameter(), 1/2))
export const times = Shape.registerMethod3(
  'times',
  ['numbers'],
  (numbers) => numbers.reduce((a, b) => a * b, 1),
  (value) => value
);

export const sin = Shape.registerMethod3(
  'sin',
  ['number'],
  (number) => Math.sin(number * Math.PI * 2),
  (value) => value
);

export const sqrt = Shape.registerMethod3(
  'sqrt',
  ['number'],
  (number) => Math.sqrt(number),
  (value) => value
);
