const canonicalize = require('./canonicalize');
const test = require('ava');
const normal = require('./normal');

test('vec2: normal() should return a vec2 with correct values', (t) => {
  t.deepEqual(canonicalize(normal([0, 0])), [0, 0]);
  t.deepEqual(canonicalize(normal([1, 2])), [-2, 1]);
  t.deepEqual(canonicalize(normal([-1, -2])), [2, -1]);
  t.deepEqual(canonicalize(normal([-1, 2])), [-2, -1]);
});
