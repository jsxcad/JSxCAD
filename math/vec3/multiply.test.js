const multiply = require('./multiply');
const test = require('ava');

test('vec3: multiply() called with two paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(multiply([0, 0, 0], [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(multiply([0, 0, 0], [1, 2, 3]), [0, 0, 0]);
  t.deepEqual(multiply([6, 6, 6], [1, 2, 3]), [6, 12, 18]);
  t.deepEqual(multiply([-6, -6, -6], [1, 2, 3]), [-6, -12, -18]);
  t.deepEqual(multiply([6, 6, 6], [-1, -2, -3]), [-6, -12, -18]);
  t.deepEqual(multiply([-6, -6, -6], [-1, -2, -3]), [6, 12, 18]);
});
