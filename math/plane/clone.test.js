const clone = require('./clone');
const test = require('ava');

test('plane: clone() should return a new plane with same values', (t) => {
  const original = [0, 0, 0, 0];
  const cloned = clone(original);
  t.deepEqual(original, cloned);
  t.not(original, cloned);
});

test('plane: clone() should return a new plane with same values', (t) => {
  const original = [1, 2, 3, 4];
  const cloned = clone(original);
  t.deepEqual(original, cloned);
  t.not(original, cloned);
});
