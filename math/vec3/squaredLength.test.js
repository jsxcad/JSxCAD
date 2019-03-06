const squaredLength = require('./squaredLength');
const test = require('ava');

test('vec3: length() should return correct values', (t) => {
  t.is(squaredLength([0, 0, 0]), 0);
  t.is(squaredLength([1, 2, 3]), 14);
  t.is(squaredLength([1, -2, 3]), 14);
  t.is(squaredLength([-1, -2, 3]), 14);
  t.is(squaredLength([-1, 2, 3]), 14);
  t.is(squaredLength([1, 2, -3]), 14);
  t.is(squaredLength([1, -2, -3]), 14);
  t.is(squaredLength([-1, -2, -3]), 14);
  t.is(squaredLength([-1, 2, -3]), 14);
});
