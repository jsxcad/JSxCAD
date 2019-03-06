const canonicalize = require('./canonicalize');
const fromAngleRadians = require('./fromAngleRadians');
const test = require('ava');

test('vec2: fromAngleRadians() should return a new vec2 with correct values', (t) => {
  t.deepEqual(canonicalize(fromAngleRadians(0)), [1, 0]);
  t.deepEqual(canonicalize(fromAngleRadians(Math.PI)), [-1, 0]);
});
