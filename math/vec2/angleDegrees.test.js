const angleDegrees = require('./angleDegrees');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;
const test = require('ava');

test('vec2: angleDegrees() should return correct values', (t) => {
  t.is(q(angleDegrees([0, 0])), 0.0);
  t.is(q(angleDegrees([1, 2])), 63.43495);
  t.is(q(angleDegrees([1, -2])), -63.43495);
  t.is(q(angleDegrees([-1, -2])), -116.56505);
  t.is(q(angleDegrees([-1, 2])), 116.56505);
});
