const fromNormalAndPoint = require('./fromNormalAndPoint');
const test = require('ava');

test('plane: fromNormalAndPoint() should return a new plant with correct values', (t) => {
  t.deepEqual(fromNormalAndPoint([5, 0, 0], [0, 0, 0]), [1, 0, 0, 0]);
  t.deepEqual(fromNormalAndPoint([0, 0, 5], [5, 5, 5]), [0, 0, 1, 5]);
});
