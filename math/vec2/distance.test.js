const distance = require('./distance');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;
const test = require('ava');

test('vec2: distance() should return correct values', (t) => {
  t.is(q(distance([0, 0], [0, 0])), 0);
  t.is(q(distance([0, 0], [1, 2])), 2.23607);
  t.is(q(distance([0, 0], [1, -2])), 2.23607);
  t.is(q(distance([0, 0], [-1, -2])), 2.23607);
  t.is(q(distance([0, 0], [-1, 2])), 2.23607);
});
