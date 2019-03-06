const signedDistanceToPoint = require('./signedDistanceToPoint');
const test = require('ava');

test('plane: signedDistanceToPoint() should return correct values', (t) => {
  t.is(signedDistanceToPoint([0, 0, 0, 0], [0, 0, 0]), 0);
  t.is(signedDistanceToPoint([1, 1, 1, 1], [-1, -1, -1]), (-3.0 - 1));
  t.is(signedDistanceToPoint([5, 5, 5, 5], [5, 5, 5]), (75 - 5));
  t.is(signedDistanceToPoint([5, 5, 5, 5], [-2, 3, -4]), (-15 - 5));
});
