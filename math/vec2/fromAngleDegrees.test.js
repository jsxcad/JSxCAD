const canonicalize = require('./canonicalize');
const fromAngleDegrees = require('./fromAngleDegrees');
const test = require('ava');

test('vec2: fromAngleDegrees() should return a new vec2 with correct values', (t) => {
  t.deepEqual(canonicalize(fromAngleDegrees(0)), [1, 0]);
  t.deepEqual(canonicalize(fromAngleDegrees(180)), [-1, 0]);
});
