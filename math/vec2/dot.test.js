const dot = require('./dot');
const test = require('ava');

test('vec2: dot() should return correct values', (t) => {
  t.is(dot([0, 0], [0, 0]), 0);
  t.is(dot([1, 1], [-1, -1]), -2);
  t.is(dot([5, 5], [5, 5]), 50);
  t.is(dot([5, 5], [-2, 3]), 5);
});
