const length = require('./length');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;
const test = require('ava');

test('vec2: length() should return correct values', (t) => {
  t.is(q(length([0, 0])), 0);
  t.is(q(length([1, 2])), 2.23607);
  t.is(q(length([1, -2])), 2.23607);
  t.is(q(length([-1, -2])), 2.23607);
  t.is(q(length([-1, 2])), 2.23607);
});
