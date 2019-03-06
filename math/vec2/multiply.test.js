const multiply = require('./multiply');
const test = require('ava');

test('vec2: multiply() called with two paramerters should return a vec2 with correct values', (t) => {
  t.deepEqual(multiply([0, 0], [0, 0]), [0, 0]);
  t.deepEqual(multiply([0, 0], [1, 2]), [0, 0]);
  t.deepEqual(multiply([6, 6], [1, 2]), [6, 12]);
  t.deepEqual(multiply([-6, -6], [1, 2]), [-6, -12]);
  t.deepEqual(multiply([6, 6], [-1, -2]), [-6, -12]);
  t.deepEqual(multiply([6, -6], [-1, -2]), [-6, 12]);
});
