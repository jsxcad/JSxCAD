const flip = require('./flip');
const test = require('ava');

test('plane: flip() called with one paramerters should return a plane with correct values', (t) => {
  t.deepEqual(flip([0, 0, 0, 0]), [-0, -0, -0, -0]);
  t.deepEqual(flip([1, 2, 3, 4]), [-1, -2, -3, -4]);
  t.deepEqual(flip([-1, -2, -3, -4]), [1, 2, 3, 4]);
  t.deepEqual(flip([-1, 2, -3, 4]), [1, -2, 3, -4]);
});
